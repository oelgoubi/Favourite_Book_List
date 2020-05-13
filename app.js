
// Create a Book class 

class Book {
    constructor(isbn,title,author)
    {
       this.isbn = isbn;
       this.title=title;
       this.author=author;
    }
     get getBookInfo()
     {
         return {
             isbn:this.isbn,
             title:this.title,
             author:this.author
         };
     }
}

// Store Class : Handle Sorage
class Store{
    // GET all the books in the Local Storage
   static getBooks()
   {
       let books;
       if(localStorage.getItem('books') === null)
       {
          books = [];
       }else{
           // in Local Storage Data is stored a String
           books = JSON.parse(localStorage.getItem('books'));;
       }
       return books;
   }

   static addBook(book){
       const books = this.getBooks();
       books.push(book);
       localStorage.setItem('books',JSON.stringify(books));
   }
   static removeBook(isbn)
   {
       const books = this.getBooks();

       const newBooks = books.filter(book => book.isbn !== isbn);
       localStorage.setItem('books',JSON.stringify(newBooks));
   }

}

// UI Class : Handling UI Tasks with static methods in Order to use them without instanciation

class UI {
    static displayBooks()
    {
      const books = Store.getBooks();

      books.forEach(book => UI.addBookToList(book))

    }

    static addBookToList(book)
    {
     const bodyTable = document.querySelector('.body-table');
     const row = document.createElement('tr');
     // Add the class delete to the anchor <a> the we will use to remove the row from the DOM
     row.innerHTML=`
          <th scope="row">${book.author}</th>\
          <td>${book.title}</td>\
          <td>${book.isbn}</td>\
          <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>\
          `;
     
    bodyTable.appendChild(row);
    }

    static deleteBook(el)
    {
        if(el.classList.contains('delete'))
        {
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className)
    {  
      // the idea is insert a div with a bootstrap class alert or success 
      const div = document.createElement('div');
      div.className = `alert alert-${className} mt-4`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('.form-book');
      container.insertBefore(div,form);

      // remove the alert after 2 sec
      setTimeout(()=>{
        // any element with class alert
        document.querySelector('.alert').remove();
      },2000);
    }
    static clearFields()
    {
        document.getElementById('bookName').value='';
        document.getElementById('author').value='';
        document.getElementById('isbn').value='';
    }

}




// Events : Display Books on Load 

document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Event : Add a book 
document.querySelector('.form-book').addEventListener('submit',(e)=>{
    // Prevent the default submit
    e.preventDefault();
    // Get form Values
    const title = document.getElementById('bookName').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
  

    // Validation of the Inputs
    if(title==='' || author==='' || isbn==='')
    {
        UI.showAlert('Please fill all the fields before sumbiting the form','danger');
    }else
    {
         // Instanciate a Book
      const book = new Book(isbn,title,author);

       //console.log(book);
      
       // Add the Book to the Local Storage
       Store.addBook(book); 

      // Add Book to the UI
      UI.addBookToList(book);
      // Show success message 
       UI.showAlert('The book was added to your list :) !','success');
    }

    // Clear Fields
    UI.clearFields();
});




// Event : Remove a Book from The List
// target the nested elements inside the body table 
document.querySelector('.body-table').addEventListener('click',(e)=>{
   
    // Remove The book from The Store  ---> GET The Isbn
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

     // Remove The book from the UI
     UI.deleteBook(e.target);

    // Show a message 
    UI.showAlert("Book was deleted",'success');
})