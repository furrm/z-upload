#Notes

The only pure AngularJS implementation.
No JQUERY required.
Works when rendered through views.
Few lines of code required.
Supports ng-repeat.

Edited the angular-masonry-directive-edit.js to allow for items to be created by a controller.
Items array  have been commented out.

test4
Removed function wrapper around the angular script in angular-masonry-directive-edit.js
Created an inline style for the masonry directive.
Added a masonry-test-tile that utilises a template.
Added the columnWidth property to the masonry directive.

test6
Added a controller to the masonry directive and added a require property to the tile directives and made the masonry
controller a dependency.
Each tile directive is calling the masonry reload and layout method which is inefficient.
Found a lib called Lo-Dash which has a function called debounced.  It's interesting in that it will delay the
execution of a function call.  For more information go to http://lodash.com/docs#debounce.

test07
Created the controllers/masonry dir as per AngularJS best practice and moved masonry directive files off the root.
Rafactoring, including creating a template for the masonry-tile
General code tidy up.