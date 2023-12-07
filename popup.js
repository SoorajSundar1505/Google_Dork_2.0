        const itemsPerPage = 5;
        let currentPage = 1;
        let capturedValues = [];
        let existingRows = [];
        let dork = '';
        
        const googleDorks = [
    { label: 'intitle:', prefix: '' },
    { label: 'inurl:', prefix: '' },
    { label: 'intext:', prefix: '' },
    { label: 'define:', prefix: '' },
    { label: 'site:', prefix: '' },
    { label: 'filetype:', prefix: '' },
    { label: 'allinurl:', prefix: '' },
    { label: 'cache:', prefix: '' },
    { label: 'inanchor:', prefix: '' },
    { label: 'types:', prefix: '' },
];

        function handleCheckboxChange(checkbox, label, input) {
            checkbox.addEventListener('change', function () {
                if (checkbox.checked) {
                    capturedValues.push({
                        label: label,
                        input: null 
                    });
                } else {
                    // Remove the captured value if the checkbox is unchecked
                    const index = capturedValues.findIndex(item => item.label === label);
                    if (index !== -1) {
                        capturedValues.splice(index, 1);
                    }
                }

                // Enable/disable input based on checkbox state
                input.disabled = !checkbox.checked;

                updateCapturedValues();
                updateSearchButton()
            });
        }

        // Event listener for capturing values when input is entered
        function handleInputChange(input, label) {
            input.addEventListener('blur', function () {
                const index = capturedValues.findIndex(item => item.label === label);
                if (index !== -1) {
                    capturedValues[index].input = input.value;
                }
                updateCapturedValues();
                updateSearchButton()
            });
        }

        function updateCapturedValues() {
            const capturedValuesContainer = document.getElementById('capturedValues');
            const valuesString = capturedValues.map(value => `${value.label}${value.input || ''}`).join(' ');
            dork=valuesString
            updateSearchButton()
        }

        function updateSearchButton() {
            const searchButton = document.getElementById('searchIconButton');
            searchButton.disabled = capturedValues.length === 0; // Disable if no checkboxes are checked
        }


        // Modify the existing displayCheckboxes function
        function displayCheckboxes(page) {
            currentPage = page;
            const tableBody = document.getElementById('checkboxBody');

            // Clear existing rows for each page
            tableBody.innerHTML = '';

            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, googleDorks.length);

            for (let i = startIndex; i < endIndex; i++) {
                let row = document.createElement('tr');

                const checkboxCell = document.createElement('td');
                checkboxCell.classList.add('first-column');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = googleDorks[i].prefix;

                const label = document.createElement('label');
                label.textContent = `${googleDorks[i].label} ${googleDorks[i].prefix}`;

                checkboxCell.appendChild(checkbox);
                checkboxCell.appendChild(label);

                const inputCell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = `Input for ${googleDorks[i].label}`;
                input.disabled = true;

                // Attach event listeners to capture values
                handleCheckboxChange(checkbox, label.textContent, input);
                handleInputChange(input, label.textContent);

                inputCell.appendChild(input);
                row.appendChild(checkboxCell);
                row.appendChild(inputCell);

                tableBody.appendChild(row);
            }

            updateCapturedValues(); // Update captured values when checkboxes are displayed
        }

        // Modify the existing generatePaginationButtons function
        function generatePaginationButtons() {
            const paginationContainer = document.getElementById('pagination');
            paginationContainer.innerHTML = ''; // Clear previous content

            for (let i = 1; i <= Math.ceil(googleDorks.length / itemsPerPage); i++) {
                const pageButton = document.createElement('div');
                pageButton.classList.add('page');
                pageButton.textContent = i;
                pageButton.onclick = function () {
                    displayCheckboxes(i);
                    highlightCurrentPageButton();
                };

                paginationContainer.appendChild(pageButton);
            }

            highlightCurrentPageButton();
        }

        // Function to highlight the current page button
        function highlightCurrentPageButton() {
            const pageButtons = document.querySelectorAll('.page');
            pageButtons.forEach(button => button.classList.remove('active'));
            pageButtons[currentPage - 1].classList.add('active');
        }

        displayCheckboxes(currentPage);
        generatePaginationButtons();

        function searchInGoogle(){
            var searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(dork);
            window.open(searchUrl, "_blank");
            searchWithDork(dork)
        }



