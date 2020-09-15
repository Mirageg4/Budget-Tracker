//create budget database

let db;
const request = window.indexedDB.open("budget", 1);
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore("pending", {
        autoIncrement: true
    });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

//error function
request.onerror = function(event) {
    console.log(error);
};