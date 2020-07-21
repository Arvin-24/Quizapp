var name;
var mailId;
$('input').keyup(function(){
    name=$("#userId").val();
    mailId=$("#emailId").val();
     $.ajax({
       url: '/verify',
       type: 'POST',
       data: {
            'emailId':mailId,
           'userId' : name,
       },
       success: function(response){
         if (response == 'taken') {
             $('span.error').html('Username Taken');
             $('button#loginb').prop('disabled', true);
          }
          else if(response =='not taken'){
            $('span.error').html('');
            sessionStorage.setItem("userName",name);
            $('button#loginb').prop('disabled', false);
          }
       }
     });
    });	




