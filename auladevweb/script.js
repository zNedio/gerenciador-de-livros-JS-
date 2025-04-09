document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('book-form');
    const booksList = document.getElementById('books-list');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const bookIdInput = document.getElementById('book-id');
    
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let editingId = null;

    cancelBtn.addEventListener('click', function() {
        bookForm.reset();
        bookIdInput.value = '';
        editingId = null;
        submitBtn.textContent = 'Salvar';
    });
    
    // Renderiza a lista de livros
    function renderBooks() {
        booksList.innerHTML = '';
        
        books.forEach(book => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.pages}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${book.id}">Editar</button>
                    <button class="action-btn delete-btn" data-id="${book.id}">Remover</button>
                </td>
            `;
            
            booksList.appendChild(row);
        });
        
        // Adiciona eventos aos botões de editar e remover
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEdit);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }
    
    // Adiciona um novo livro ou atualiza um existente
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const pages = document.getElementById('pages').value;
        const id = bookIdInput.value || Date.now().toString();
        
        if (editingId) {
            // Atualiza o livro existente
            books = books.map(book => 
                book.id === editingId ? { id, title, author, year, pages } : book
            );
            editingId = null;
            submitBtn.textContent = 'Salvar';
            cancelBtn.style.display = 'inline-block';
        } else {
            // Adiciona um novo livro
            books.push({ id, title, author, year, pages });
        }
        
        // Salva no localStorage e renderiza a lista
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
        
        // Limpa o formulário
        bookForm.reset();
        bookIdInput.value = '';
    });
    
    // Cancela a edição
    cancelBtn.addEventListener('click', function() {
        bookForm.reset();
        bookIdInput.value = '';
        editingId = null;
        submitBtn.textContent = 'Salvar';
        cancelBtn.style.display = 'inline-block';
    });
    
    // Edita um livro
    function handleEdit(e) {
        const id = e.target.getAttribute('data-id');
        const book = books.find(book => book.id === id);
        
        if (book) {
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('year').value = book.year;
            document.getElementById('pages').value = book.pages;
            bookIdInput.value = book.id;
            
            editingId = id;
            submitBtn.textContent = 'Salvar';
            cancelBtn.style.display = 'inline-block';
        }
    }
    
    // Remove um livro
    function handleDelete(e) {
        const id = e.target.getAttribute('data-id');
        
        if (confirm('Tem certeza que deseja remover este livro?')) {
            books = books.filter(book => book.id !== id);
            localStorage.setItem('books', JSON.stringify(books));
            renderBooks();
            
            // Se estava editando o livro removido, cancela a edição
            if (editingId === id) {
                bookForm.reset();
                bookIdInput.value = '';
                editingId = null;
                submitBtn.textContent = 'Salvar';
                cancelBtn.style.display = 'inline-block';
            }
        }
    }
    
    // Renderiza os livros ao carregar a página
    renderBooks();
});