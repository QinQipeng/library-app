const MYLIBRARY = [];
const CONTAINER = document.querySelector(".container");
const FORMCONTAINER = document.querySelector(".form-container");
const BOOKFORM = FORMCONTAINER.querySelector(".book-form");

let bookNum = 0;
const formRows = FORMCONTAINER.querySelectorAll(".form-row");
const formButtons = {
    ".edit-button":     undefined,
    ".delete-button":   undefined,
    ".close-button":    undefined,
    ".cancel-button":   undefined,
    ".add-button":      undefined
}
const bookView = {
    ".black-overlay":   undefined,
    ".legacy-form-row": undefined,
}
const formButtonRow = document.querySelector(".book-form .button-row")

Object.keys(formButtons).forEach(key => formButtons[key] = FORMCONTAINER.querySelector(key))
Object.keys(bookView).forEach(key =>    bookView[key] = document.querySelector(key))


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
    MYLIBRARY.push(new_book);
}

function createNewBook (book_info) {
    const new_book = {
        "book":     undefined, 
        "cover":    undefined, 
        "beneath":  undefined,
        "bookmark": undefined
    };

    for(const cls of Object.keys(new_book)){
        if (cls == "bookmark") {
            new_book[cls] = document.createElement('button');
            new_book[cls].setAttribute('title', book_info.hasRead ? "has read" : "not read yet");
        } else {
            new_book[cls] = document.createElement('div');
        }
        new_book[cls].classList.add(cls);
    }

    new_book["bookmark"].innerHTML = `<svg viewBox="0 0 125 200" version="1.1" xmlns="http://www.w3.org/2000/svg" width="125"><path d="M0,0v200l62.5-62.5,62.5,62.5V0H0Z"/></svg>`

    const cover_info = {
        'title': document.createElement('h1'), 
        'author': document.createElement('h2'),
        'year': document.createElement('h3')
    }
    for (const [attr, info] of Object.entries(cover_info)){
        info.textContent = book_info[attr];
        new_book["cover"].appendChild(info);
    }
    new_book["beneath"].appendChild(new_book["bookmark"]);
    new_book["book"].appendChild(new_book["cover"]);
    new_book["book"].appendChild(new_book["beneath"]);
    new_book["book"].setAttribute("id",book_info.id);
    return new_book;  
}

const _visualizeClasses = function(classes, option) {
    Object.keys(classes).forEach(key => {
        classes[key].style.visibility = option ? "visible" : "hidden"
        if (key == ".legacy-form-row") {
            classes[key].style.position = option ? "relative" : "absolute"
        }
    });
}

function _updateBookForm(info = null) {
    formRows.forEach(row => {
        const row_input = row.querySelector("input") ?? row.querySelector("textarea");
        if (info == null){
            row_input.value = "";
            row_input.readOnly = false;
        } else {
            row_input.value = info[row_input.getAttribute('id')];
            row_input.readOnly = true;
        }
    })
}

function displayAllBook(container) {
    bookView[".form-container"] = FORMCONTAINER;
    bookView[".edit-button"] = formButtons[".edit-button"];

    for(let i = bookNum; i < MYLIBRARY.length; i++) {
        // console.log(book.info());
        const book_info = MYLIBRARY[i];
        const new_book = createNewBook(book_info);

        new_book["bookmark"].addEventListener('click',(e)=>{
            e.preventDefault();
            e.stopPropagation();
            book_info.hasRead = !book_info.hasRead;
            new_book["bookmark"].setAttribute("style", book_info.hasRead ? 
                ("background-color: yellowgreen; fill: yellowgreen;"):
                ("background-color: red; fill: red;"));

            const read_status = book_info.hasRead ? "has-read" : "not-read-yet";
            new_book["bookmark"].setAttribute('title', read_status);

            bookView['.legacy-form-row'].querySelectorAll("input[type='radio']").forEach(radio => {
                const radioID = radio.getAttribute("id");
                if(radioID == read_status) {
                    radio.checked = true;
                }else{
                    radio.checked = false;
                }
            })
        })

        new_book["book"].addEventListener("click", () => {
            FORMCONTAINER.setAttribute("current_book",`${book_info.id}`)
            formButtonRow.setAttribute("style", "visibility:hidden; position:absolute");
            _visualizeClasses(bookView,true);
            _updateBookForm(book_info);

            const read_status = book_info.hasRead ? "has-read" : "not-read-yet";
            bookView['.legacy-form-row'].querySelectorAll("input[type='radio']").forEach(radio => {
                const radioID = radio.getAttribute("id");
                if(radioID == read_status) {
                    radio.checked = true;
                }else{
                    radio.checked = false;
                }
            })
        })

        container.appendChild(new_book["book"]);
        bookNum++;
    }

    //  setting up functionalities for the buttons in the form that displays book info
    Array.from(document.getElementsByName("read-status")).forEach(radioButton => {
        radioButton.addEventListener("input",(e) => {
            const readStatus = e.target.id;
            // console.log(`readStatus: ${readStatus}`)
            const currentBookID = FORMCONTAINER.getAttribute("current_book")
            const book2bUpdated = MYLIBRARY.find(book => book.id == currentBookID);
            book2bUpdated.hasRead = readStatus == "has-read" ? true : false;
            // console.log(book2bUpdated);
        })
    })

    
    formButtons[".close-button"].addEventListener("click",(e)=>{
        e.stopPropagation();
        _visualizeClasses(bookView,false);
        // Updates the color of the booknote
        const hasRead = Array.from(FORMCONTAINER.querySelectorAll("input[type='radio']"))
                             .find(radio => radio.checked).id;
        // console.log(`${typeof(hasRead)}: ${hasRead}`);
        // console.log(hasRead)
        
        if(FORMCONTAINER.getAttribute("current_book")){
            const bookDOMElement = document.getElementById(FORMCONTAINER.getAttribute("current_book"));
            const bookMark = bookDOMElement.querySelector(".bookmark");
            bookMark.setAttribute("style", hasRead == "has-read" ? 
                    ("background-color: yellowgreen; fill: yellowgreen;"):
                    ("background-color: red; fill: red;"));

            bookMark.setAttribute('title', hasRead == "has-read" ? "has read" : "not read yet");
        }

        FORMCONTAINER.removeAttribute("current_book");
        FORMCONTAINER.style.visibility = "hidden";
        formButtonRow.setAttribute("style", "visibility:hidden; position:absolute");
        formButtons[".delete-button"].setAttribute("style", "visibility:hidden;");
        formButtons[".cancel-button"].setAttribute("style", "visibility:hidden; position:absolute");
    })

    formButtons[".cancel-button"].addEventListener("click",()=>{
        const currentBookID = FORMCONTAINER.getAttribute("current_book");
        const originalInfo = MYLIBRARY.find(book => book.id == currentBookID);

        formRows.forEach(row => {
            const row_input = row.querySelector("input") ?? row.querySelector("textarea");
            row_input.readOnly = true;
        })
        formButtonRow.setAttribute("style", "visibility:hidden; position:absolute");
        formButtons[".edit-button"].setAttribute("style", "visibility:visible;");
        formButtons[".delete-button"].setAttribute("style", "visibility:hidden;");
        formButtons[".cancel-button"].setAttribute("style", "visibility:hidden; position:absolute");
        _updateBookForm(originalInfo);
    })
    
    formButtons[".edit-button"].addEventListener("click",()=>{
        formRows.forEach(row => {
            const row_input = row.querySelector("input") ?? row.querySelector("textarea");
            row_input.readOnly = false;
        })
        // Long buttons in the button row (save, add)
        formButtonRow.setAttribute("style", "visibility:visible; position:relative");
        formButtons[".add-button"].classList.add("save-button");
        formButtons[".add-button"].textContent = "Save Book";

        // Round buttons
        formButtons[".cancel-button"].setAttribute("style", "visibility:visible; position:relative");
        formButtons[".edit-button"].setAttribute("style", "visibility:hidden; position:absolute");
        formButtons[".delete-button"].setAttribute("style", "visibility:visible;");
    })

    formButtons[".delete-button"].addEventListener("click",()=>{
        const deletedBook = MYLIBRARY.find(element => element.id == FORMCONTAINER.getAttribute("current_book"));
        MYLIBRARY.splice(MYLIBRARY.indexOf(deletedBook),1);
        CONTAINER.removeChild(document.getElementById(FORMCONTAINER.getAttribute("current_book")));
        FORMCONTAINER.removeAttribute("current_book");
        formButtons[".close-button"].click();
    })

    formButtons[".add-button"].addEventListener("click",(e)=>{
        const currentBookID = FORMCONTAINER.getAttribute("current_book");
        if(currentBookID) {
            // console.log(`Save new info for the book ${currentBookID}`);
            const updatableInfo = ['title','author','year','pages','description'];
            const coverInfo = ["h1","h2","h3"];
            const bookDOMElement = document.getElementById(currentBookID);

            // Updates the data of the book in the array
            const book2bUpdated = MYLIBRARY.find(book => book.id == currentBookID);
            updatableInfo.forEach(info => {
                book2bUpdated[info] = FORMCONTAINER.querySelector(`#${info}`).value;
            })
            // console.log(book2bUpdated);
            // Updates the display of the book
            for(let i = 0; i < coverInfo.length; i++){
                bookDOMElement.querySelector(coverInfo[i]).textContent 
                = FORMCONTAINER.querySelector(`#${updatableInfo[i]}`).value;
            }
        }
        // formButtons[".close-button"].click();
    })
}

addBookToLibrary("Pride and Prejudice","Jane Austen","1813","432");
addBookToLibrary("Moby-Dick","Herman Melville","1851","624");
addBookToLibrary("Les Misérables","Victor Hugo","1862","1460");
addBookToLibrary("Anna Karenina","Leo Tolstoy","1878","864");
addBookToLibrary("The Great Gatsby","F. Scott Fitzgerald","1925","180");
addBookToLibrary("1984","George Orwell","1949","328");

displayAllBook(CONTAINER);

const addBookButton = document.querySelector(".add-book");
addBookButton.addEventListener('click', () => {
    _updateBookForm();
    formButtonRow.setAttribute("style", "visibility:visible; position:relative");

    bookView[".black-overlay"].style.visibility = "visible";
    FORMCONTAINER.style.visibility = "visible";
    
    formButtons[".add-button"].classList = ["add-button"];
    formButtons[".add-button"].textContent = "Add Book";
    formButtons[".add-button"].addEventListener('click', (e)=> {
        const newBook_info = {
            'title':        null,
            'author':       null,
            'year':         null,
            'pages':        null,
            'description':  null
        };

        Object.keys(newBook_info).forEach(key => {
            newBook_info[key]=BOOKFORM.querySelector(`#${key}`).value;
        })
        // console.log(newBook_info);

        for(const [key, value] of Object.entries(newBook_info)){
            if (value == '' && key != 'description') {
                // console.log(`required info for "${key}" is missing!`);
                return;
            }
        }

        addBookToLibrary(
            newBook_info['title'],
            newBook_info['author'],
            newBook_info['year'],
            newBook_info['pages'],
            newBook_info['description']
        );

        displayAllBook(CONTAINER);
        formButtons[".close-button"].click();
    })    
})

BOOKFORM.addEventListener("submit",(e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
})