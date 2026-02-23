const myLibrary = [];
let bookNum = 0;

function Book(title, author, year, pages) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.year = year;
    this.pages = pages;
    this.hasRead = false;
    this.description = '';

    this.info = function() {
        return `BookID ${this.id}: ${this.title} by ${this.author} in ${this.year}, `+
        `${this.pages} pages, ${this.hasRead ? "has read" : "not read yet"}`
    }
}

function addBookToLibrary(title, author, year, pages) {
    const new_book = new Book(title, author, year, pages);
    myLibrary.push(new_book);
}

function displayAllBook() {

    for(let i = bookNum; i < myLibrary.length; i++) {
        // console.log(book.info());
        const book = myLibrary[i];
        const container = document.querySelector(".container");

        const new_book = document.createElement('div');
        new_book.classList.add("book");

        const new_book_cover = document.createElement('div');
        new_book_cover.classList.add("cover");

        const new_book_beneath = document.createElement('div');
        new_book_beneath.classList.add("beneath");

        const new_bookmark = document.createElement('button');
        new_bookmark.classList.add("bookmark");
        new_bookmark.setAttribute('title', book.hasRead ? "has read" : "not read yet");
        new_bookmark.innerHTML = `<svg viewBox="0 0 125 200" version="1.1" xmlns="http://www.w3.org/2000/svg" width="125"><path d="M0,0v200l62.5-62.5,62.5,62.5V0H0Z"/></svg>`
        new_bookmark.addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation();
            book.hasRead = !book.hasRead;
            new_bookmark.setAttribute("style", book.hasRead ? ("background-color: green; fill: green;"):("background-color: red; fill: red;"));
            new_bookmark.setAttribute('title', book.hasRead ? "has read" : "not read yet");
        })
        
        const cover_info = {
            'title': document.createElement('h1'), 
            'author': document.createElement('h2'),
            'year': document.createElement('h3')
        }

        for (const [attr, info] of Object.entries(cover_info)){
            info.textContent = book[attr];
            new_book_cover.appendChild(info);
        }

        new_book_beneath.appendChild(new_bookmark);
        new_book.appendChild(new_book_cover);
        new_book.appendChild(new_book_beneath);

        new_book.addEventListener('click',() => {
            const overlay = document.querySelector(".black-overlay");
            const formContainer = document.querySelector(".form-container");
            const editButton = document.querySelector(".edit-button");
            const legacyFormRow = document.querySelector(".legacy-form-row");
            legacyFormRow.style.position = "relative";

            editButton.style.visibility = "visible";
            overlay.style.visibility = "visible";
            formContainer.style.visibility = "visible";
            legacyFormRow.style.visibility = "visible";

            const formRows = document.querySelectorAll(".form-row")
            for (const row of formRows) {
                const row_input = row.querySelector("input") ?? row.querySelector("textarea");
                row_input.value = book[row_input.getAttribute('id')];
                row_input.readOnly = true;
            }

            const read_status = book.hasRead ? "has-read" : "not-read-yet";
            legacyFormRow.querySelector(`input[id='${read_status}']`).setAttribute("checked",true);
            legacyFormRow.setAttribute('readOnly',true);

            const closeButton = document.querySelector(".close-button");
            closeButton.addEventListener('click', ()=> {
                overlay.style.visibility = "hidden";
                formContainer.style.visibility = "hidden";
                legacyFormRow.style.visibility = "hidden";
                editButton.style.visibility = "hidden";
                legacyFormRow.style.position = "absolute";
            })
        })

        container.appendChild(new_book);
        bookNum++;
    }
}

addBookToLibrary("Pride and Prejudice","Jane Austen","1813","432");
addBookToLibrary("Moby-Dick","Herman Melville","1851","624");
addBookToLibrary("Les Misérables","Victor Hugo","1862","1460");
addBookToLibrary("Anna Karenina","Leo Tolstoy","1878","864");
addBookToLibrary("The Great Gatsby","F. Scott Fitzgerald","1925","180");
addBookToLibrary("1984","George Orwell","1949","328");

displayAllBook();

const addBookButton = document.querySelector(".add-book");
addBookButton.addEventListener('click', () => {
    const overlay = document.querySelector(".black-overlay");
    const formContainer = document.querySelector(".form-container");

    overlay.style.visibility = "visible";
    formContainer.style.visibility = "visible";

    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener('click', ()=> {
        overlay.style.visibility = "hidden";
        formContainer.style.visibility = "hidden";
    })

    const bookForm = document.querySelector('.book-form');
    const addButton = document.querySelector('.button-row .add');
    addButton.addEventListener('click', ()=> {
        const newBook_info = {
            'title': bookForm.querySelector("#title").value,
            'author': bookForm.querySelector("#author").value,
            'year': bookForm.querySelector("#year").value,
            'pages': bookForm.querySelector("#pages").value,
            'description': bookForm.querySelector("#description").value
        };

        addBookToLibrary(
            newBook_info['title'],
            newBook_info['author'],
            newBook_info['year'],
            newBook_info['pages'],
            newBook_info['description']
        );

        displayAllBook();
        closeButton.click();
    })    
})