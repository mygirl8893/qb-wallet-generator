jQuery(function($) {
  $( "#pincode" ).on( "keyup", function() {
//      $( ".text-error" ).hide();
      if (this.value.length > 4) {
          this.value = this.value.slice(0,4); 
      }
  });  
});

/*

jQuery(function($) {
  var enteredCode = "";
  $('#pincode').pincodeInput({inputs:4,placeholders:"o o o o",complete:function(value, e, errorElement){
      console.log("code entered: " + value);
    
      enteredCode = value;
        
    
 //       $(errorElement).html("I'm sorry, but the code not correct");
  }});
  $( ".pincode-input-container" ).on( "click", function() {
    $('.pincode-input-text').val("");
    $('.pincode-input-text.first').focus();
  });
  $( "#send-pin" ).on( "click", function() {
    alert(enteredCode);
  });
});
*/