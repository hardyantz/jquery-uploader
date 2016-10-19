<!DOCTYPE html>
<html lang="en">
<head>
<title>Jquery Upload Preview</title>
<link rel="stylesheet" href="../src/css/jquery.upload-preview.css" type="text/css"/>
<link rel="stylesheet" href="../src/plugins/jquery-ui-1.12.1.custom/jquery-ui.css" type="text/css"/>

</head>
<body>
<form method="post" action="save.php" enctype="multipart/form-data">
<div id="image-preview" class="upload-preview" >
  
</div>
<div>
<input type="submit" name="submit" value="submit">
</div>
</form>

<!--<input type="file" id="image-upload" class="upload" multiple/>-->
</body>

<script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
<script src="../src/plugins/jquery-ui-1.12.1.custom/jquery-ui.js" type="text/javascript"></script>
<script src="../src/js/jquery.upload-preview.js" type="text/javascript"></script>

<script type="text/javascript">
$(document).ready(function() {
    $.uploadPreview({
        input_box: ".upload-preview",   // Default: .image-upload
        no_label: false                 // Default: false
    });
});
</script>
</html>