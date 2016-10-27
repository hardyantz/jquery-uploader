(function($) {
    var jupload_id_div_image = 'image-upload'
    var jupload_div_image = '#' + jupload_id_div_image;
    var text_clickable = '<div class="noimg-message">Drop files here or click to upload</div>';

    // is IE
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;

    $.extend({
        uploadPreview: function(options) {

            // Options + Defaults
            var settings = $.extend({
                input_box: ".upload-preview",
                input_field: ".upload",
                preview_box: ".image-preview",
                files_name: "mmdc_scbundle_morisproduct[uploads]",
                label_field: ".image-label",
                label_default: "Choose File",
                label_selected: "Change File",
                no_label: false
            }, options);

            $('<input type="hidden" id="count-file-input" value="0"/>').insertAfter(settings.input_box);
            $(settings.input_box).html(text_clickable);

            $(settings.input_box + ', .noimg-message').on(
                'dragover',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            )
            $(settings.input_box + ', .noimg-message').on(
                'dragenter',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                }
            )

            $(settings.input_box + ', .noimg-message').on(
                'drop',
                function(e) {
                    $('.noimg-message').remove();
                    $('<input  type="file" style="display:none;"  class="image-upload-class" id="' + jupload_id_div_image + '-' + $("#count-file-input").val() + '" name="' + settings.files_name + '[]" multiple/>').insertAfter(settings.input_box);

                    if (e.originalEvent.dataTransfer) {
                        if (e.originalEvent.dataTransfer.files.length) {
                            e.preventDefault();
                            e.stopPropagation();
                            var imageLoader = document.getElementById(jupload_id_div_image + '-' + $("#count-file-input").val());
                            var dt = e.originalEvent.dataTransfer;
                            var files = dt.files;

                            imageLoader.files = files;
                            var idInput = jupload_id_div_image + '-' + $("#count-file-input").val();
                            iterateFiles(e.originalEvent.dataTransfer.files, settings, idInput);
                        }
                    }
                }
            );

            $(settings.input_box + ', .noimg-message').on('click', function(e) {
                e.preventDefault();
                if (e.target !== this) {
                    return;
                }

                $('<input type="file" style="" class="image-upload-class" id="' + jupload_id_div_image + '-' + $("#count-file-input").val() + '" name="' + settings.files_name + '[]" multiple/>').insertAfter(settings.input_box);
                
                if (isIE) {
                    $(jupload_div_image + '-' + $("#count-file-input").val()).on('change', handleIEImage);
                }
                $(jupload_div_image + '-' + $("#count-file-input").val())[0].click();
                var imageLoader = document.getElementById(jupload_id_div_image + '-' + $("#count-file-input").val());
                
                if (isIE) {
                    //imageLoader.addEventListener('load', handleImage, false);
                } else {
                    imageLoader.addEventListener('change', handleIEImage, false);
                }
            });

            if ((window.File && window.FileList && window.FileReader) === false) {
                alert("Browser not compatible for image uploader.");
                return false;
            }

            function handleIEImage(e) {
                var files = this.files;
                if (files.length > 0) {
                    var idInput = jupload_id_div_image + '-' + $("#count-file-input").val();
                    iterateFiles(files, settings, idInput);

                    $('.noimg-message').remove();
                    var imageLoader = document.getElementById(idInput);
                    imageLoader.files = files;
                } else {
                    var text_clickable = '<div class="noimg-message">Drop files here or click to upload</div>';

                    $(settings.input_box).html(text_clickable);
                    return false;
                }
            }
        }
    });

    function handleImage(e) {
        var files = this.files;
        if (files.length > 0) {
            var idInput = jupload_id_div_image + '-' + $("#count-file-input").val();
            iterateFiles(files, settings, idInput);

            $('.noimg-message').remove();
            var imageLoader = document.getElementById(idInput);
            imageLoader.files = files;
        } else {
            var text_clickable = '<div class="noimg-message">Drop files here or click to upload</div>';

            $(settings.input_box).html(text_clickable);
            return false;
        }
    }

    function iterateFiles(files, settings, idInput) {

        if ($(".preview-item").length > 0) {
            $('.noimg-message').remove();
        }

        var count_preview = $("#count-file-input").val();

        for (var l = 0; l < files.length; l++) {
            if (files[l].type.match('image') == null) {
                $('#' + idInput).remove();
                alert(files[l].name + ", This file type is not supported yet.");
                return;
            }
        }

        $.each(files, function(i, file) {
            var index = i + count_preview;

            var reader = new FileReader();

            reader.addEventListener("load", function(event) {
                renderPreview(event, index, settings, file.name, idInput);

            });

            if (settings.no_label == false) {
                $(settings.label_field).html(settings.label_selected);
            }

            reader.readAsDataURL(file);
        });

        if (typeof $(settings.input_box).sortable("instance") != 'undefined') {
            $(settings.input_box).sortable("destroy");
        }
        $(settings.input_box).sortable({
            scroll: true,
            items: "> .preview-item",
            stop: function(event, ui) {
                setPrimary();
            }
        });
        $(settings.input_box).disableSelection();
    }

    function renderPreview(loadedFile, i, settings, filename, idInput) {

        if (loadedFile.target.result !== '') {
            image = new Image();
            image.src = loadedFile.target.result;
            image.onload = function() {
                var w = this.width,
                    h = this.height;

                if (((w < 500) || (w > 2000)) || ((h < 500) || (h > 2000))) {
                    alert(filename + ', invalid image size');
                } else {

                    $(settings.input_box).append("<div class='preview-item " + idInput + "' input-file='" + idInput + "' id='preview-" + i + "'></div>");
                    var sequence_input = '<input type="hidden" name="sequence[]" value="' + filename + '">';
                    var remove_button = '<div class="img-overlay"><button class="btn btn-md btn-danger" data-id="' + i + '" id="remove-' + i + '">Remove</button></div>';
                    $('#preview-' + i).html('<div class="img-wrapper"><img src="' + loadedFile.target.result + '" class="img-responsive img-list"> ' + remove_button + ' </div>' + sequence_input);
                    var remove_id = document.getElementById('remove-' + i);
                    remove_id.addEventListener('click', removeBox(settings.input_box, i, idInput), false);

                    setPrimary();
                }
            }
        }

        $("#count-file-input").val(parseInt($("#count-file-input").val()) + 1);
    }

    function removeBox(input_box, id, idInput) {
        return function() {
            $("#preview-" + id).remove();
            if ($(".preview-item").length <= 0) {
                $(input_box).html(text_clickable);
            }

            if ($("." + idInput).length <= 0) {
                $("#" + idInput).remove();
            }

            setPrimary();
        }
    }

    function setPrimary() {
        var primary_img = '<i class="fa fa-check-circle-o fa-4x text-success" id="primary-img" aria-hidden="true" style="position: absolute;margin-top: -20px;margin-left: -20px;"></i>';
        $("#primary-img").remove();
        $(".preview-item").first().append(primary_img);

    }
})(jQuery);
