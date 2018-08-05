var config = {
    apiKey: "AIzaSyAsXvSSpzrSOYa_OAHrrWJenk5A4tqQcrA",
    authDomain: "chattirealtors-4ca32.firebaseapp.com",
    databaseURL: "https://chattirealtors-4ca32.firebaseio.com",
    projectId: "chattirealtors-4ca32",
    storageBucket: "chattirealtors-4ca32.appspot.com",
    messagingSenderId: "522456850017"
  };
  firebase.initializeApp(config);

  var uploadedUrl;
  var uploader = document.getElementById("uploader");
  var fileButton = document.getElementById("fileButton");
  var db = firebase.firestore();

  fileButton.addEventListener('change', function(e){
    var file = e.target.files[0];
    var storageref =  firebase.storage().ref('/admin/'+ file.name);
    var task = storageref.put(file);
    task.on('state_changed', 
    function progress(snapshot){
        var percentage = snapshot.bytesTransferred/snapshot.totalBytes* 100;
        uploader.value = percentage;
    },
    function error(e){

    },
    function complete(){
        task.snapshot.ref.getDownloadURL().then(function(url){
            console.log("Uploaded");
            uploadedUrl = url;
        })
    }        
)
  });


  function submitPost(){
    db.collection("Posts").add({
        Heading: document.getElementById('heading').value,
        Location: document.getElementById('location').value,
        Price: document.getElementById('price').value,
        Negotioable: document.getElementById('neg').value,
        Rate: document.getElementById('rate').value,
        Developments: document.getElementById('developments').value,
        Hike: document.getElementById('hike').value,
        Note: document.getElementById('note').value,
        Image: uploadedUrl
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }