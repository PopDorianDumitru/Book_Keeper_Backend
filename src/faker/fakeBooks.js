const { default: axios } = require("axios");


const books = [
    {
        ID: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        language: "English",
        year: 1925
    },
    {
        ID: "2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        language: "English",
        year: 1960
    },
    {
        ID: "3",
        title: "1984",
        author: "George Orwell",
        language: "English",
        year: 1949
    },
    {
        ID: "4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        language: "English",
        year: 1813
    },
    {
        ID: "5",
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        language: "English",
        year: 1951
    },
    {
        ID: "6",
        title: "Moby Dick",
        author: "Herman Melville",
        language: "English",
        year: 1851
    },
    {
        ID: "7",
        title: "War and Peace",
        author: "Leo Tolstoy",
        language: "English",
        year: 1869
    },
    {
        ID: "8",
        title: "The Odyssey",
        author: "Homer",
        language: "English",
        year: 800
    },
    {
        ID: "9",
        title: "Ulysses",
        author: "James Joyce",
        language: "English",
        year: 1922
    },
    {
        ID: "10",
        title: "Madame Bovary",
        author: "Gustave Flaubert",
        language: "English",
        year: 1856
    },
    {
        ID: "11",
        title: "The Divine Comedy",
        author: "Dante Alighieri",
        language: "English",
        year: 1320
    },
    {
        ID: "12",
        title: "The Brothers Karamazov",
        author: "Fyodor Dostoevsky",
        language: "English",
        year: 1880
    },
    {
        ID: "13",
        title: "Don Quixote",
        author: "Miguel de Cervantes",
        language: "English",
        year: 1615
    },
    {
        ID: "14",
        title: "The Iliad",
        author: "Homer",
        language: "English",
        year: 750
    },
    {
        ID: "15",
        title: "Hamlet",
        author: "William Shakespeare",
        language: "English",
        year: 1603
    },

    {
        ID: "16",
        title: "The Adventures of Huckleberry Finn",
        author: "Mark Twain",
        language: "English",
        year: 1884
    },
    {
        ID: "17",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        language: "English",
        year: 1813
    },
    {
        ID: "18",
        title: "1984",
        author: "George Orwell",
        language: "English",
        year: 1949
    },
    {
        ID: "19",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        language: "English",
        year: 1925
    },
    {
        ID: "20",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        language: "English",
        year: 1960
    },

];

const fake = async () => {
    const books = axios.get("")
}
fake();
