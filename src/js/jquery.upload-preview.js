(function ($) {
  var jupload_id_div_image = 'image-upload'
  var jupload_div_image = '#' + jupload_id_div_image;

  $.extend({
    uploadPreview : function (options) {

        // Options + Defaults
        var settings = $.extend({
            input_box: ".upload-preview",
            input_field: ".upload",
            preview_box: ".image-preview",
            files_name: "uploader",
            label_field: ".image-label",
            label_default: "Choose File",
            label_selected: "Change File",
            no_label: false
        }, options);

        $('<input type="text" id="count-file-input" value="0"/>').insertAfter(settings.input_box);

        $(settings.input_box).on(
            'dragover',
            function(e) {
                e.preventDefault();
                e.stopPropagation();
          }
        )
        $(settings.input_box).on(
            'dragenter',
            function(e) {
                e.preventDefault();
                e.stopPropagation();
            }
        )

        $(settings.input_box).on(
            'drop',
            function(e){

                $('<input type="file" id="'+jupload_id_div_image+'-' +$("#count-file-input").val()+ '" name="'+settings.files_name+'[]" multiple/>').insertAfter(settings.input_box);
                if(e.originalEvent.dataTransfer){
                    if(e.originalEvent.dataTransfer.files.length) {
                        e.preventDefault();
                        e.stopPropagation();
                        var imageLoader = document.getElementById(jupload_id_div_image +'-'+$("#count-file-input").val());

                        /*UPLOAD FILES HERE*/
                        var dt = e.originalEvent.dataTransfer;
                        var files = dt.files;
                        console.log(files);
                        //this code line fires your 'handleImage' function (imageLoader change event)
                        imageLoader.files = files;
                        iterateFiles(e.originalEvent.dataTransfer.files, settings);
                        $("#count-file-input").val($("#count-file-input").val() + 1);
                    }
                }
            }
        );

        //$(jupload_div_image).hide();

        $(settings.input_box).on('click', function(e){
            e.preventDefault();
            $('<input type="file" class="image-upload-class" id="'+jupload_id_div_image+'-' + $("#count-file-input").val() +'" name="'+settings.files_name+'[]" multiple/>').insertAfter(settings.input_box);
            $(jupload_div_image+'-'+$("#count-file-input").val())[0].click();
            var imageLoader = document.getElementById(jupload_id_div_image +'-'+$("#count-file-input").val());
            imageLoader.addEventListener('change', handleImage, false);
        })

        // Check if FileReader is available
        if ((window.File && window.FileList && window.FileReader) === false) {
            alert("Browser not compatible for image uploader.");
            return false;
        }

        function handleImage(e) {
            console.log(this.files);
            var files = this.files;
            if (files.length > 0) {
                iterateFiles(files, settings);
                $('.message').remove();
                var imageLoader = document.getElementById(jupload_id_div_image +'-'+$("#count-file-input").val());
                imageLoader.files = files;
                $("#count-file-input").val($("#count-file-input").val() + 1);
            } else {
                var text_clickable ='<div class="message needsclick">Drop files here or click to upload</div>';
                // Clear background
                $(settings.input_box).html(text_clickable);
            }
        };

        $( settings.input_box ).sortable();
        $( settings.input_box ).disableSelection();
    }
  });

  function iterateFiles(files, settings) {
    var count_preview = $(".preview-item").length;

    $.each( files, function( i, file ) {
        var index = i + count_preview;

        var reader = new FileReader();

        // Load file
        reader.addEventListener("load",function(event) {
            var loadedFile = event.target;

            // Check format
            if (file.type.match('image')) {
                // Image
                renderPreview(loadedFile, index, settings);
            } else {
                alert("This file type is not supported yet.");
            }
        });

        if (settings.no_label == false) {
        // Change label
        $(settings.label_field).html(settings.label_selected);
        }

        // Read the file
        reader.readAsDataURL(file);
    });
  }
  function renderPreview(loadedFile, i, settings) {
    $( settings.input_box ).append( "<div class='preview-item' id='preview-" + i + "''></div>" );
    $("#preview-" + i).html('<img src="'+loadedFile.result+'">');
  }
})(jQuery);