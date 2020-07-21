var questions=[];          //question array of string
var options=[];               //options array [4]
var answer=[];             //answers array
var correctCount = 0 ;     //correct answer count 
var questionCount=-1;      //question number count
var c=600;           //time in reverse
var timeTaken=0;    //total time taken
var wrongQuesNum=[];
var userAnswer=[];

validateJson(quizSet);
 function validateJson(quizSet){
    for(var i=0;i<10;i++)
    {
    questions[i]=quizSet[i].ques;
    options[i]=quizSet[i].options;
    answer[i]=quizSet[i].ans;
    }
 
 }
 questionGenerate();
 timedCount();

//  $('button.option').click(function(){
//    $(this).toggleClass("active");  
//  });

var user_name = sessionStorage.getItem("userName");

$("h5.name").html(user_name);

$("form.logout").submit(function(){

    sessionStorage.removeItem("userName");
});

 function questionGenerate()
 { 
   // alert(userID,mailId);
   //  $("a.check").show();
   
    $("a.next").hide();
   clearOptions();
   questionCount++;
   if(questionCount<10){
   $("h1.quesnum").html("Question "+(questionCount+1));
   $("p.ques").html(questions[questionCount]);
   $("#opt1").html(options[questionCount][0]);
   $("#opt2").html(options[questionCount][1]);
   $("#opt3").html(options[questionCount][2]);
   $("#opt4").html(options[questionCount][3]);
   toggleActive();
   }

   else{
      c=9999;
      showScore();
   }
 }
 


 function checkAnswer(){
   if($("button.option").hasClass("active"))
   {
   var userChoice=$("button.active");
   userAnswer[questionCount]=(userChoice).html();
   if(userChoice.html()==answer[questionCount] )
   {
      correctCount++;
      userChoice.removeClass("active");
      userChoice.addClass("correct1");
      $(document).ready(function() { 
         setTimeout(function() { 
            questionGenerate();  
      }, 500); 
      });
   }
   else{
      wrongQuesNum.push(questionCount)
      userChoice.addClass("wrong1");
      userChoice.removeClass("active");
      for(var i=1;i<5;i++)
      {
         if($("#opt"+i).html()==answer[questionCount])
            {
            $("#opt"+i).addClass("correct1");
            }
            $("#opt"+i).addClass("visited");
      }
      // $("a.check").hide();
      // $("a.next").show();
      $(document).ready(function() { 
         setTimeout(function() { 
            questionGenerate();  
      }, 1500); 
   });
  }
}
   else
   {
      alert ("Select an option");
   }
 }


function clearOptions()
{
   for(var i=1;i<5;i++)
   {
      $("#opt"+i).removeClass("correct1 wrong1 active visited");
   }
}





function toggleActive()
{
$("button.option").click(function(){
   for(var i=1;i<5;i++)
      {
         if($("button#opt"+i).hasClass("active"))
         {
         $("button#opt"+i).removeClass("active");
         }
      }
      if($(this).hasClass("visited")){
      }
      else{
      $(this).addClass("active");
      }
});
}


function timedCount()
		{
        	var minutes = parseInt( c / 60 ) % 60;
        	var seconds = c % 60;
        	var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
            
        	$('span.timer').html(result);
            if(c == 0 )
			{
            showScore();
            alert("Time ended");
            c=10000  ;
         }

            //     ("#quiz_form").submit();
				// window.location="logout.html";
            timeTaken++;
            c = c - 1;
            t = setTimeout(function()
			   {
               if(c==9999)
               {
                 showScore();
               }
               else{
                  timedCount();
               }
			   },
			   1000);
        }



var report=[];
function showScore(){ 

   var minutes = parseInt(timeTaken / 60 ) % 60;
   var seconds = timeTaken % 60;
   var result=(minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
   $("span.timer").html("Time taken "+result);


for(var i=0;i<wrongQuesNum.length;i++)
{
   report.push({
   "qNum":wrongQuesNum[i],
   "questionReport":questions[wrongQuesNum[i]],
   "answerReport":answer[wrongQuesNum[i]],
   "userReport":userAnswer[wrongQuesNum[i]]
   })
}
    $.ajax({
      url: '/question',
      type: 'POST',
      data: {"rep":report,"answeredCorrect":correctCount,"attended":(questionCount-1),"timeTaken":result}
  }); 
   // $("form.result").show();
   // $("input.score").attr("value",correctCount);
   $("form.result").submit();

}











////////////////////////////////////-------------------login.html-----------------------------------///////////////////////

