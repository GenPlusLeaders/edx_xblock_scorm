function ScormXBlock(runtime, element, settings) {
  function SCORM_12_API(){

    this.LMSInitialize = function(){
      $('.sequence-nav', window.parent.document).slideUp();
      // Changes background color to theme blue
      $('iframe.scorm_object').contents().find('body').css('background-color', '#000f30')
      return "true";
    };

    this.LMSFinish = function() {
      $('.sequence-nav', window.parent.document).slideDown();
      return "true";
    };

    this.LMSGetValue = GetValue;
    this.LMSSetValue = SetValue;
    this.GoToPreviousLocation = GoToPreviousLocation;
    this.GoToNextLocation = GoToNextLocation;

    this.LMSCommit = function() {
        return "true";
    };

    this.LMSGetLastError = function() {
      return "0";
    };

    this.LMSGetErrorString = function(errorCode) {
      return "Some Error";
    };

    this.LMSGetDiagnostic = function(errorCode) {
      return "Some Diagnostice";
    }
  }

  function SCORM_2004_API(){
    this.Initialize = function(){
      $('.sequence-nav', window.parent.document).slideUp();
      // Changes background color to theme blue
      $('iframe.scorm_object').contents().find('body').css('background-color', '#000f30')
      return "true";
    };

    this.Terminate = function() {
      $('.sequence-nav', window.parent.document).slideDown();
      return "true";
    };

    this.GetValue = GetValue;
    this.SetValue = SetValue;
    this.GoToPreviousLocation = GoToPreviousLocation;
    this.GoToNextLocation = GoToNextLocation;

    this.Commit = function() {
        return "true";
    };

    this.GetLastError = function() {
      return "0";
    };

    this.GetErrorString = function(errorCode) {
      return "Some Error";
    };

    this.GetDiagnostic = function(errorCode) {
      return "Some Diagnostice";
    }
  }

  var GoToPreviousLocation = function() {
    $('.sequence-nav .button-previous', window.parent.document).click();
  }

  var GoToNextLocation = function() {
    $('.sequence-nav .button-next', window.parent.document).click();
  }

  var GetValue = function (cmi_element) {
    var handlerUrl = runtime.handlerUrl(element, 'scorm_get_value');
    var response = $.ajax({
      type: "POST",
      url: handlerUrl,
      data: JSON.stringify({'name': cmi_element}),
      async: false
    });
    response = JSON.parse(response.responseText);
    return response.value
  };

  var SetValue = function (cmi_element, value) {
    if (cmi_element === 'cmi.core.exit' || cmi_element === 'cmi.exit') {
      $(".js-scorm-block", element).removeClass('full-screen-scorm');
    }

    var handlerUrl = runtime.handlerUrl( element, 'scorm_set_value');

    $.ajax({
      type: "POST",
      url: handlerUrl,
      data: JSON.stringify({'name': cmi_element, 'value': value}),
      success: function(response){
        if (typeof response.lesson_score != "undefined"){
          $(".lesson_score", element).html(response.lesson_score);
        }
        $(".completion_status", element).html(response.completion_status);
      }
    });

    return "true";
  };

  $(function ($) {
    if (settings.version_scorm == 'SCORM_12') {
      API = new SCORM_12_API();
    } else {
      API_1484_11 = new SCORM_2004_API();
    }

    var $scormBlock = $(".js-scorm-block", element);
    $('.js-button-full-screen', element).on( "click", function() {
      $scormBlock.toggleClass("full-screen-scorm");
    });
  });

  // When the user clicks on the button, open the modal
  $('.scormModalBtn').on ("click", function(event) {
    var modal_id = '#' + $(event.currentTarget).data('scorm-id') + '_scormModal'
    $(modal_id).show();
  });

  // When the user clicks on <span> (x), close the modal
  $('.scormModalClose').on ("click", function(event) {
    var modal_id = '#' + $(event.currentTarget).data('scorm-id') + '_scormModal'
    $(modal_id).hide();
  });
}
