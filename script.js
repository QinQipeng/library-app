const myLibrary = [];

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
    for(const book of myLibrary) {
        // console.log(book.info());
        const container = document.querySelector(".container");

        const new_book = document.createElement('div');
        new_book.classList.add("book")

        const new_book_cover = document.createElement('div');
        new_book_cover.classList.add("cover")

        const new_book_beneath = document.createElement('div');
        new_book_beneath.classList.add("beneath")

        const cover_info = {
            'title': document.createElement('h1'), 
            'author': document.createElement('h2'),
            'year': document.createElement('h3')
        }

        for (const [attr, info] of Object.entries(cover_info)){
            // info.textContent = book.
            info.textContent = book[attr];
            new_book_cover.appendChild(info);
        }

        new_book.appendChild(new_book_cover);
        new_book.appendChild(new_book_beneath);
        

        container.appendChild(new_book);
    }
}

addBookToLibrary("Pride and Prejudice","Jane Austen","1813","432");
addBookToLibrary("Moby-Dick","Herman Melville","1851","624");
addBookToLibrary("Les Misérables","Victor Hugo","1862","1460");
addBookToLibrary("Anna Karenina","Leo Tolstoy","1878","864");
addBookToLibrary("The Great Gatsby","F. Scott Fitzgerald","1925","180");
addBookToLibrary("1984","George Orwell","1949","328");

displayAllBook();