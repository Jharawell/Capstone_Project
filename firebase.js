const firebaseConfig = {
    apiKey: "AIzaSyCaSHRLbIRWW8COl5iwHb19dMDYYLJ2DIk",
    authDomain: "centralcomm-248a9.firebaseapp.com",
    databaseURL: "https://centralcomm-248a9-default-rtdb.firebaseio.com",
    projectId: "centralcomm-248a9",
    storageBucket: "centralcomm-248a9.firebasestorage.app",
    messagingSenderId: "796912003621",
    appId: "1:796912003621:web:0d6fd82e43399871a9edcc",
    measurementId: "G-CN0S9L5YV4"
    };

    firebase.initializeApp(firebaseConfig);

    const database = firebase.database();
    
    const db = firebase.database().ref('recSecItem');

    document.getElementById('rec_sec_item').addEventListener('submit', save);

    function save(e) {
        e.preventDefault(); 
    
        var time = document.getElementById("row1.2.1").value;
        var date = document.getElementById("row1.2.2").value;
        var ctrlnum = document.getElementById("row1.2.3").value;
        var from = document.getElementById("row1.2.4").value;
        var office = document.getElementById("row1.2.5").value;
        var sub = document.getElementById("row1.2.6").value;
    
        // Debugging logs
        console.log("Time:", time);
        console.log("Date:", date);
        console.log("Ctrl No:", ctrlnum);
        console.log("From:", from);
        console.log("Office:", office);
        console.log("Subject:", sub);
    
        saveNew(time, date, ctrlnum, from, office, sub);
    }

    const saveNew = (time, date, ctrlnum, from, office, sub) => {
        var newItemRec = db.push(); 
    
        newItemRec.set({
            timeReceived: time,
            dateReceived: date,
            controlNumber: ctrlnum,
            from: from,
            office: office,
            subject: sub
        })
        .then(() => {
            console.log("Data saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
    };
    


const getElementVal = (id) => {
    return document.getElementById(id).value;
}
