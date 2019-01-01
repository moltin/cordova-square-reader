module.exports = function(ctx) {

  var fs = ctx.requireCordovaModule('fs');
  var path = ctx.requireCordovaModule('path');

  // Read project config file and get the name of the project
  var config_path = path.join(__dirname, '/../../../config.xml');

  fs.readFile(config_path, 'utf8', function(err, data) {

    if (!err && data) {

      var name_start = data.indexOf('<name>');
      var name_end = data.indexOf('</name>');

      var project_name = data.substring(name_start, name_end);
      project_name = project_name.replace('<name>', '').trim();

      // next we need to read the file app delegate file
      var app_delegate_path = path.join(__dirname,'/../../../platforms/ios/' + project_name + '/Classes/AppDelegate.m');

      fs.readFile(app_delegate_path, 'utf8', function(err, data) {
        if (!err && data) {

          // Add the import for the square sdk header file
          var square_import_search_string = '#import "MainViewController.h"';
          var square_import_start = data.indexOf(square_import_search_string) + square_import_search_string.length;

          var content_start = data.substring(0, square_import_start);
          var content_end = data.substring(square_import_start);

          var new_app_delegate_content = content_start;
          new_app_delegate_content += '\n#import <SquareReaderSDK/SquareReaderSDK.h>';
          new_app_delegate_content += content_end;

          // Add the code to initialize the square reader sdk
          var square_init_search_string = '{';
          var square_init_start = new_app_delegate_content.indexOf(square_init_search_string) + square_init_search_string.length;

          content_start = new_app_delegate_content.substring(0, square_init_start);
          content_end = new_app_delegate_content.substring(square_init_start);

          new_app_delegate_content = content_start;
          new_app_delegate_content += '\n\t// Initialize Square Reader SDK\n\t[SQRDReaderSDK initializeWithApplicationLaunchOptions:launchOptions];';
          new_app_delegate_content += content_end;

          // Write to the file with the new updates
          fs.writeFile(app_delegate_path, new_app_delegate_content, function(err) {
            if (!err) {
              console.log('\x1b[32m%s\x1b[0m', 'Success! The Square SDK initializer was added to the AppDelegate file');
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