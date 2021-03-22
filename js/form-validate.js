// const { text } = require("body-parser");

// console.log(products);
var score_card_data = JSON.parse(JSON.stringify(data));  //solves the problem
var total = 0;
            
owner = "maha";
var api_url = "https://api.scorecardengine.com";
$(function () {
    $.validator.setDefaults({
      submitHandler: function () {
        alert( "Form successful submitted!" );
      }
    });
    $('#validateForm').validate({
      rules: {
            api_key: {
                required: true,
                minlength:2
            },
            score_card: {
                required: true
            },
            version: {
            required: true
            },
        },
        messages: {
            api_key: {
            required: "API key is required",
            minlength: "Please enter valid api key"
            },
            score_card: "Please select score card",
            version: "Version number is required"
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        submitHandler: function(form) {
            var error = 0;
            var success = 0;

            api_key = $("#api_key").val();
            score_card = $("#score_card").val();
            version = $("#version").val();


            if(score_card == "Green Financing Loan"){
                var identifier = score_card_data[4].green_financing_loan.identifier;
                data = score_card_data[4].green_financing_loan;
            }else if(score_card=="V6"){
                var identifier = score_card_data[1].farmer_loan.identifier;
                data = score_card_data[1].farmer_loan;
            }else if(score_card=="Non-Financial Parameter Score"){
                var identifier = score_card_data[3].non_financial_score.identifier;
                data = score_card_data[3].non_financial_score;
            }else if(score_card=="Non-Financial Parameters"){
                var identifier = score_card_data[0].non_financial.identifier;
                data = score_card_data[0].non_financial;
            }else if(score_card=="Financial Parameters"){
                var identifier = score_card_data[2].financial_paramenters.identifier;
                data = score_card_data[2].financial_paramenters;
            }

//  Get all lists API without version 

            $.ajax({
                type: "GET",
                url: api_url+'/'+owner+'/scorecard/'+score_card+'/arguments',
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    success= success+1;
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card+'/arguments';
                    show_success_data(message_url,data,success);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card+'/arguments';
                    error = error +1; 
                    show_error_data(message_url,data,error);
                }

            });

//  Get all lists API with version  
            $.ajax({
                type: "GET",
                url: api_url+'/'+owner+'/scorecard/'+score_card+'/'+version+'/arguments',
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    success= success+1;
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card+'/'+version+'/arguments';
                    show_success_data(message_url,data,success);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    error = error +1; 
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card+'/'+version+'/arguments';
                    show_error_data(message_url,data,error);
                }
            });

//  Calculate Score API with Version  
            $.ajax({
                type: "POST",
                url: api_url+'/'+owner+'/scorecard/'+score_card+'/'+version,
                data: data,
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card+'/'+version;
                    if(data.error){
                        error = error +1; 
                        show_error_data(message_url,data,error);
                    }else{
                        success= success+1;
                        show_success_data(message_url,data,success);
                    }
                    
                    
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    error = error +1; 
                    $("#error_count").text(error);
                    show_error_data(message_url,data,error);
                }
            });

//  Calculate Score API without Version 
            $.ajax({
                type: "POST",
                url: api_url+'/'+owner+'/scorecard/'+score_card,
                data: data,
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card;
                    if(data.error){
                        error = error +1; 
                        show_error_data(message_url,data,error);
                    }else{
                        success= success+1;
                        show_success_data(message_url,data,success);
                    }
                    
                    
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    error = error +1; 
                    $("#error_count").text(error);
                    toastr.error('Sorry, API (Calculate score via inputs) has not run successfully ')
                }
            });

//  Additive API Call
            $.ajax({
                type: "POST",
                url: api_url+'/scoring/'+identifier+'/additive',
                data: data,
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    message_url = api_url+'/'+owner+'/scorecard/'+score_card;
                    if(data.error){
                        error = error +1; 
                        show_error_data(message_url,data,error);
                    }else{
                        success= success+1;
                        show_success_data(message_url,data,success);
                    }
                    
                    
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    error = error +1; 
                    $("#error_count").text(error);
                    toastr.error('Sorry, API (Calculate score via inputs) has not run successfully ')
                }
            });

//  Get relative score API call via request identifier
            $.ajax({
                type: "GET",
                url: api_url+'/scoring/'+identifier,
                dataType: 'json',
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    success= success+1;
                    message_url = api_url+'/scoring/'+identifier;
                    show_success_data(message_url,data,success);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    error = error +1; 
                    message_url = api_url+'/scoring/'+identifier;
                    show_error_data(message_url,data,error);
                }
            });

//  Download Score Result

            $.ajax({
                type: "GET",
                url: api_url+'/scoring/'+identifier+'/download',
                dataType: 'application/pdf',
                contentType: "application/pdf",
                headers: {
                    "Api-Token": api_key
                },
                success: function (data){
                    success= success+1;
                    message_url = api_url+'/scoring/'+identifier+'/download';
                    show_success_data(message_url,data,success);
                },
                error: function (jqXHR, textStatus, errorThrown) { 
                    message_url = api_url+'/scoring/'+identifier+'/download';
                    if(data){
                        success= success+1;
                        show_success_data(message_url,data,success);
                    }else{
                        error = error +1; 
                        show_error_data(message_url,data,error);
                    }
                    
                }
            });

            


            
        }
    });
});

function show_success_data(url, data, count){
    total = total+1;
    $("#success_count").text(count);
    head_message = "<p style='color:green'>API has run completely, No issue!</p>"
    // toastr.success('API has run completely, No issue!');
    show_json = JSON.stringify(data);
    data_append = '<div class="card card-success"><div class="card-header"><h4 class="card-title w-100"><a class="d-block w-100" data-toggle="collapse" href="#collapse'+total+'" id="headFive">'+url+'</a></h4></div><div id="collapse'+total+'" class="collapse" data-parent="#accordion"><div class="card-body"><p id="return_result_head">'+head_message+'</p><p id="return_result">'+show_json+'</p></div></div></div>';
    $("#accordion").append(data_append);
}

function show_error_data(url, data, count){
    
     $("#error_count").text(count);
     total = total+1;
    head_message = "<p style='color:red'>Sorry, API has not run successfully</p>";
    // toastr.error('Sorry, API has not run successfully ');
    show_json = JSON.stringify(data);
    data_append = '<div class="card card-danger"><div class="card-header"><h4 class="card-title w-100"><a class="d-block w-100" data-toggle="collapse" href="#collapse'+total+'" id="headFive">'+url+'</a></h4></div><div id="collapse'+total+'" class="collapse" data-parent="#accordion"><div class="card-body"><p id="return_result_head">'+head_message+'</p><p id="return_result">'+show_json+'</p></div></div></div>';
    $("#accordion").append(data_append);
}

$("#score_card").change(function(){
    score_card_name = $("#score_card").val();
    if(score_card_name == "Non-Financial Parameter Score"){
        option = "<option value='1'>1</option><option value='2'>2</option><option value='3'>3</option>";
        
    }else{
        option = "<option value='1'>1</option>";
    }
    $("#version").html(option)
    $("#accordion").text('');
    $("#success_count").text(0);
    $("#error_count").text(0);
})

$("#version").change(function(){
    $("#accordion").text('');
    $("#success_count").text(0);
    $("#error_count").text(0);
})