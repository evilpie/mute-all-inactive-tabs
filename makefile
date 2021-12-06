PACKAGE_NAME=mute-all-inactive-tabs
FILES=background.js icons/ LICENSE manifest.json

package:
	zip -r -FS $(PACKAGE_NAME).xpi $(FILES) --exclude '**/.*'
