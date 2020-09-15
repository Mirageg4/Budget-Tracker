//create wrapper - budget database
let db;
const request = window.indexedDB.open("budget", 1);
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    //Create Object Store
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

//Save item to Object Store
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const budgetStore = transaction.objectStore("pending");
    budgetStore.add(record);  
}

//create pending transaction
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const budgetStore = transaction.objectStore("pending");
    const getAll = budgetStore.getAll();

    // Retrieve all objects in the index
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

            //Open transaction in pending db
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const budgetStore = transaction.objectStore("pending");
               
                //Clear stored items
                budgetStore.clear();

            });
        }
    };
}

//Listener for app when back online
window.addEventListener("online", checkDatabase);