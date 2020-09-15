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

//create pending transaction
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const budgetStore = transaction.objectStore("pending");
    const getAll = budgetStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body:JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })

            
        }
    }
}