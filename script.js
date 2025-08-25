class ChordTransposer {
    constructor() {
        this.keys = [
            'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 
            'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
        ];
        
        this.keyMap = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
            'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };
        
        this.chordTypes = [
            '', 'm', 'dim', 'aug', 'sus2', 'sus4',
            '7', 'maj7', 'm7', 'dim7', 'aug7', 'm7b5',
            '6', 'm6', 'add9', 'madd9', '9', 'maj9', 'm9',
            '11', 'maj11', 'm11', '13', 'maj13', 'm13'
        ];
        
        this.chordCount = 1;
        this.init();
    }
    
    init() {
        this.generateInitialChordInput();
        this.bindEvents();
        this.initPresets();
    }
    
    bindEvents() {
        document.getElementById('add-chord').addEventListener('click', () => this.addChordInput());
        document.getElementById('transpose').addEventListener('click', () => this.transposeAll());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());
        document.getElementById('load-preset').addEventListener('click', () => this.loadPreset());
    }
    
    generateInitialChordInput() {
        const container = document.getElementById('chord-inputs');
        container.innerHTML = '';
        this.chordCount = 1;
        this.createChordInput(1);
    }
    
    createChordInput(index) {
        const container = document.getElementById('chord-inputs');
        const chordDiv = document.createElement('div');
        chordDiv.className = 'chord-input';
        chordDiv.setAttribute('data-index', index);
        
        const keyOptions = Object.keys(this.keyMap).map(key => 
            `<option value="${key}">${key}</option>`
        ).join('');
        
        const chordTypeOptions = this.chordTypes.map(type => 
            `<option value="${type}">${type || 'Major'}</option>`
        ).join('');
        
        chordDiv.innerHTML = `
            <label>Chord ${index}:</label>
            <select class="key-select">
                <option value="">Select Key</option>
                ${keyOptions}
            </select>
            <select class="chord-type-select">
                ${chordTypeOptions}
            </select>
            <button type="button" class="remove-chord" onclick="transposer.removeChordInput(${index})">Remove</button>
        `;
        
        container.appendChild(chordDiv);
    }
    
    addChordInput() {
        if (this.chordCount >= 20) {
            alert('Maximum 20 chords allowed');
            return;
        }
        
        this.chordCount++;
        this.createChordInput(this.chordCount);
    }
    
    removeChordInput(index) {
        const chordInput = document.querySelector(`[data-index="${index}"]`);
        if (chordInput) {
            chordInput.remove();
        }
        
        // If no chord inputs remain, add one
        const remainingInputs = document.querySelectorAll('.chord-input');
        if (remainingInputs.length === 0) {
            this.chordCount = 0;
            this.addChordInput();
        }
    }
    
    clearAll() {
        document.getElementById('chord-inputs').innerHTML = '';
        document.getElementById('transposition-grid').innerHTML = '';
        document.getElementById('result-section').classList.add('hidden');
        this.chordCount = 0;
        this.addChordInput();
    }
    
    getEnteredChords() {
        const chords = [];
        const chordInputs = document.querySelectorAll('.chord-input');
        
        chordInputs.forEach(input => {
            const keySelect = input.querySelector('.key-select');
            const typeSelect = input.querySelector('.chord-type-select');
            
            if (keySelect.value) {
                chords.push({
                    key: keySelect.value,
                    type: typeSelect.value,
                    display: keySelect.value + (typeSelect.value || '')
                });
            }
        });
        
        return chords;
    }
    
    transposeChord(originalKey, targetKeyIndex) {
        const originalIndex = this.keyMap[originalKey];
        const transposition = (targetKeyIndex - originalIndex + 12) % 12;
        return this.keys[(originalIndex + transposition) % 12];
    }
    
    transposeAll() {
        const enteredChords = this.getEnteredChords();
        
        if (enteredChords.length === 0) {
            alert('Please enter at least one chord');
            return;
        }
        
        this.generateTranspositionGrid(enteredChords);
        document.getElementById('result-section').classList.remove('hidden');
        
        // Smooth scroll to results
        document.getElementById('result-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    generateTranspositionGrid(chords) {
        const grid = document.getElementById('transposition-grid');
        
        // Create header
        let html = '<thead><tr><th>Key</th>';
        chords.forEach(chord => {
            html += `<th>${chord.display}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Create rows for each key
        this.keys.forEach((key, keyIndex) => {
            html += `<tr><td>${key}</td>`;
            
            chords.forEach(chord => {
                const transposedKey = this.transposeChord(chord.key, keyIndex);
                const transposedChord = transposedKey + chord.type;
                html += `<td>${transposedChord}</td>`;
            });
            
            html += '</tr>';
        });
        
        html += '</tbody>';
        grid.innerHTML = html;
    }
    
    initPresets() {
        this.presets = {
            'pop1': [
                {key: 'C', type: '', display: 'C'},
                {key: 'G', type: '', display: 'G'}, 
                {key: 'A', type: 'm', display: 'Am'},
                {key: 'F', type: '', display: 'F'}
            ],
            'pop2': [
                {key: 'A', type: 'm', display: 'Am'},
                {key: 'F', type: '', display: 'F'},
                {key: 'C', type: '', display: 'C'},
                {key: 'G', type: '', display: 'G'}
            ],
            'jazz1': [
                {key: 'D', type: 'm7', display: 'Dm7'},
                {key: 'G', type: '7', display: 'G7'},
                {key: 'C', type: 'maj7', display: 'Cmaj7'}
            ],
            'basic1': [
                {key: 'C', type: '', display: 'C'},
                {key: 'F', type: '', display: 'F'},
                {key: 'G', type: '', display: 'G'}
            ],
            'basic2': [
                {key: 'A', type: 'm', display: 'Am'},
                {key: 'D', type: 'm', display: 'Dm'},
                {key: 'E', type: '', display: 'E'}
            ],
            'blues': [
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'F', type: '7', display: 'F7'}, {key: 'F', type: '7', display: 'F7'},
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'G', type: '7', display: 'G7'}, {key: 'F', type: '7', display: 'F7'},
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}
            ],
            'circle': [
                {key: 'A', type: 'm7', display: 'Am7'},
                {key: 'D', type: 'm7', display: 'Dm7'},
                {key: 'G', type: '7', display: 'G7'},
                {key: 'C', type: 'maj7', display: 'Cmaj7'}
            ],
            'modal': [
                {key: 'C', type: '', display: 'C'},
                {key: 'A#', type: '', display: 'Bb'},
                {key: 'F', type: '', display: 'F'},
                {key: 'C', type: '', display: 'C'}
            ],

            // Pop & Rock progressions
            'pop3': [
                {key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'},
                {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}
            ],
            'pop4': [
                {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'},
                {key: 'A', type: 'm', display: 'Am'}, {key: 'E', type: 'm', display: 'Em'},
                {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'},
                {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}
            ],
            'pop5': [{key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}],
            'pop6': [{key: 'C', type: '', display: 'C'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}],
            'pop7': [{key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}],
            'pop8': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'pop9': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}, {key: 'A', type: 'm', display: 'Am'}],
            'pop10': [{key: 'C', type: '', display: 'C'}, {key: 'G#', type: '', display: 'Ab'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'C', type: '', display: 'C'}],
            
            'rock1': [{key: 'C', type: '', display: 'C'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}],
            'rock2': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}],
            'rock3': [{key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}],
            'rock4': [{key: 'A', type: 'm', display: 'Am'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'A', type: 'm', display: 'Am'}],
            'rock5': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'F', type: '', display: 'F'}],
            'rock6': [{key: 'A', type: 'm', display: 'Am'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}],
            'rock7': [{key: 'C', type: '', display: 'C'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'rock8': [{key: 'A', type: 'm', display: 'Am'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}],

            // Jazz progressions
            'jazz2': [{key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'A', type: 'm7', display: 'Am7'}],
            'jazz3': [
                {key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'},
                {key: 'E', type: 'm7', display: 'Em7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}
            ],
            'jazz4': [{key: 'E', type: 'm7', display: 'Em7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}],
            'jazz5': [{key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'F', type: 'm7', display: 'Fm7'}],
            'jazz6': [{key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'E', type: 'm7', display: 'Em7'}, {key: 'A', type: 'm7', display: 'Am7'}],
            'jazz7': [{key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'C#', type: '7', display: 'C#7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}],
            'jazz8': [
                {key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: 'maj7', display: 'Cmaj7'},
                {key: 'F', type: 'maj7', display: 'Fmaj7'}, {key: 'B', type: 'm7b5', display: 'Bm7b5'}, {key: 'E', type: 'm7', display: 'Em7'}, {key: 'A', type: 'm7', display: 'Am7'}
            ],
            'jazz9': [{key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'E', type: '7', display: 'E7'}],
            'jazz10': [{key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'F', type: 'maj7', display: 'Fmaj7'}, {key: 'G', type: '7', display: 'G7'}],
            'jazz11': [{key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'C#', type: '7', display: 'C#7'}],
            'jazz12': [{key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'E', type: '7', display: 'E7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: '7', display: 'A7'}],
            'jazz13': [{key: 'D', type: 'm7', display: 'Dm7'}, {key: 'C#', type: '7', display: 'C#7'}, {key: 'C', type: 'maj7', display: 'Cmaj7'}],
            'jazz14': [{key: 'C', type: 'maj7', display: 'Cmaj7'}, {key: 'E', type: '7', display: 'E7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: 'maj7', display: 'Cmaj7'}],

            // Blues variations
            'blues2': [
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'F', type: '7', display: 'F7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'G', type: '7', display: 'G7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'G', type: '7', display: 'G7'}
            ],
            'blues3': [
                {key: 'C', type: '7', display: 'C7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'F', type: '7', display: 'F7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'G', type: '7', display: 'G7'},
                {key: 'F', type: '7', display: 'F7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}
            ],
            'blues4': [
                {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: 'm7', display: 'Am7'},
                {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: 'm7', display: 'Am7'},
                {key: 'E', type: '7', display: 'E7'}, {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'A', type: 'm7', display: 'Am7'}, {key: 'A', type: 'm7', display: 'Am7'}
            ],
            'blues5': [
                {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'C', type: '7', display: 'C7'},
                {key: 'F', type: '7', display: 'F7'}, {key: 'F#', type: 'dim7', display: 'F#dim7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'A', type: 'm7', display: 'Am7'},
                {key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: '7', display: 'C7'}, {key: 'G', type: '7', display: 'G7'}
            ],
            'blues6': [
                {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'},
                {key: 'F', type: '', display: 'F'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'},
                {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'}
            ],
            'blues7': [{key: 'C', type: '7', display: 'C7'}, {key: 'A#', type: '7', display: 'Bb7'}, {key: 'F', type: '7', display: 'F7'}, {key: 'C', type: '7', display: 'C7'}],
            'blues8': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}],

            // Add all other preset categories with similar structure
            'folk1': [{key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}],
            'folk2': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'folk3': [{key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'A', type: 'm', display: 'Am'}],
            'folk4': [{key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'folk5': [{key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'E', type: '', display: 'E'}, {key: 'A', type: 'm', display: 'Am'}],
            
            'country1': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'country2': [{key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}, {key: 'C', type: '', display: 'C'}],
            'country3': [{key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}],
            'country4': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'country5': [{key: 'C', type: '', display: 'C'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],

            // Continue with all other categories...
            'rnb1': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}],
            'rnb2': [{key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}],
            
            // Add remaining presets with basic implementations
            'rnb3': [{key: 'C', type: '', display: 'C'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}, {key: 'C', type: '', display: 'C'}],
            'rnb4': [{key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}, {key: 'F', type: '', display: 'F'}],
            'rnb5': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'G', type: '', display: 'G'}],
            'rnb6': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'A', type: 'm', display: 'Am'}],
            'rnb7': [{key: 'C', type: '', display: 'C'}, {key: 'E', type: 'm', display: 'Em'}, {key: 'F', type: '', display: 'F'}, {key: 'F', type: 'm', display: 'Fm'}],
            'rnb8': [{key: 'A', type: 'm', display: 'Am'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'D', type: 'm', display: 'Dm'}],
            'rnb9': [{key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}],
            'rnb10': [{key: 'D', type: 'm7', display: 'Dm7'}, {key: 'G', type: '7', display: 'G7'}, {key: 'C', type: '', display: 'C'}, {key: 'E', type: 'm7', display: 'Em7'}, {key: 'A', type: 'm7', display: 'Am7'}],

            // Add basic implementations for all remaining categories
            'reggae1': [{key: 'C', type: '', display: 'C'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}],
            'reggae2': [{key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'G', type: '', display: 'G'}],
            'reggae3': [{key: 'C', type: '', display: 'C'}, {key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}],
            'reggae4': [{key: 'A', type: 'm', display: 'Am'}, {key: 'D', type: 'm', display: 'Dm'}, {key: 'E', type: '', display: 'E'}, {key: 'A', type: 'm', display: 'Am'}],
            'caribbean1': [{key: 'C', type: '', display: 'C'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}],
            'caribbean2': [{key: 'C', type: '', display: 'C'}, {key: 'A#', type: '', display: 'Bb'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}],
            'caribbean3': [{key: 'A', type: 'm', display: 'Am'}, {key: 'F', type: '', display: 'F'}, {key: 'G', type: '', display: 'G'}, {key: 'A', type: 'm', display: 'Am'}]
        };
    }
    
    loadPreset() {
        const presetSelect = document.getElementById('preset-select');
        const selectedPreset = presetSelect.value;
        
        if (!selectedPreset || !this.presets[selectedPreset]) {
            return;
        }
        
        const presetChords = this.presets[selectedPreset];
        
        // Clear existing inputs
        document.getElementById('chord-inputs').innerHTML = '';
        
        // Create inputs for each chord in the preset
        this.chordCount = 0;
        presetChords.forEach((chord, index) => {
            this.chordCount++;
            this.createChordInput(this.chordCount);
            
            // Set the values
            const chordInput = document.querySelector(`[data-index="${this.chordCount}"]`);
            const keySelect = chordInput.querySelector('.key-select');
            const typeSelect = chordInput.querySelector('.chord-type-select');
            
            keySelect.value = chord.key;
            typeSelect.value = chord.type;
        });
    }
}

// Initialize the transposer when the page loads
const transposer = new ChordTransposer();