module.exports = function(ctx) {
  var fs = ctx.requireCordovaModule('fs');
  var path = ctx.requireCordovaModule('path');

  // Read project config file and get the name of the project
  var config_path = path.join(__dirname, "/../../../config.xml");

  fs.readFile(config_path, "utf8", function(err, data) {
    if (!err && data) {
      var name_start = data.indexOf("<name>");
      var name_end = data.indexOf("</name>");

      var project_name = data.substring(name_start, name_end);
      project_name = project_name.replace("<name>", "").trim();

      // next we need to read the file app delegate file
      var app_delegate_path = path.join(__dirname, "/../../../platforms/ios/" + project_name + "/Classes/AppDelegate.m");

      fs.readFile(app_delegate_path, "utf8", function(err, data) {
        if (!err && data) {
          var new_app_delegate_content = data
            .replace(/\n\#import \<SquareReaderSDK\/SquareReaderSDK.h\>/g, "")
            .replace(/\n\t\/\/ Initialize Square Reader SDK/g, "")
            .replace(/\n\t\[SQRDReaderSDK initializeWithApplicationLaunchOptions:launchOptions\];/g, "");

          // Write to the file with the new updates
          fs.writeFile(app_delegate_path, new_app_delegate_content, function(
            err
          ) {
            if (!err) {
              console.log('\x1b[32m%s\x1b[0m', 'Success! The Square SDK initializer was removed from the AppDelegate file');
            } else {
              console.log('\x1b[31m%s\x1b[0m', 'Error: Could not update app delegate file');
            }
          });
        } else {
          console.log('\x1b[31m%s\x1b[0m', 'Error: Could not read app delegate file');
        }
      });
    } else {
      console.log('\x1b[31m%s\x1b[0m', 'Error: Could not read project config.xml');
    }
  });
};