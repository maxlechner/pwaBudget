let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  const pendingStore = db.createObjectStore( "pendingList", {
    autoIncrement: true
  });
};

request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  if (err => {
    response.json(err);
  });
};

function saveRecord( record ) {
  console.log( record );
  const transaction = db.transaction( ["pendingList"], "readwrite" );
  const pendingListStore = transaction.objectStore( "pendingList" );
  pendingListStore.add( record ); 
}

function checkDatabase() {
  const transaction = db.transaction(["pendingList"], "readwrite");
  const pendingListStore = transaction.objectStore("pendingList");
  const getAll = pendingListStore.getAll();
  console.log(pendingListStore);
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pendingList"], "readwrite");
          const pendingListStore = transaction.objectStore("pendingList");
          pendingListStore.clear();
          console.log(pendingListStore);
        });
    }
  };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);


