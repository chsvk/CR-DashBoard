var config = {
    apiKey: "AIzaSyAsXvSSpzrSOYa_OAHrrWJenk5A4tqQcrA",
    authDomain: "chattirealtors-4ca32.firebaseapp.com",
    databaseURL: "https://chattirealtors-4ca32.firebaseio.com",
    projectId: "chattirealtors-4ca32",
    storageBucket: "chattirealtors-4ca32.appspot.com",
    messagingSenderId: "522456850017"
  };
  firebase.initializeApp(config);


  document.getElementById("fileButton").multiple = true;
  var uploader = document.getElementById("uploader");
  var fileButton = document.getElementById("fileButton");
  var db = firebase.firestore();
  var imageUrls = [];

  fileButton.addEventListener('change', function(e){
      allComplete = false;
      for( var i=0; i<e.target.files.length; i++){
          var imagefile = e.target.files[i];
          uploadImageToFirebase(imagefile, i , e.target.files.length);
      }
  });

  function uploadImageToFirebase(image, current, total){
      return new Promise(function(resolve, reject){
          var storageref = firebase.storage().ref('admin/' + image.name +  guid());
          var task = storageref.put(image);
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
                    imageUrls.push(url);
                    snack(current + 1 + " Images Uploaded out of " + total);
                })
            }        
        )
      })
  }

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


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
        Facing: document.getElementById('facing').value,
        Length: document.getElementById('length').value,
        Breadth: document.getElementById('breadth').value,
        BusRoute: document.getElementById('busRoute').value,
        Image: imageUrls
    })
    .then(function(docRef) {
        snack("Property Uploaded");
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }



//   SNACKBAR FUNCTION

function snack(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 