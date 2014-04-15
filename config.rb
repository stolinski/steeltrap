# Require any additional compass plugins installed on your system.
require 'compass-normalize'
require 'rgbapng'
require 'toolkit'
require 'breakpoint'
require 'sass-globbing'

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "public/css"
sass_dir = "public/scss"
images_dir = "public/images"
javascripts_dir = "public/js"
fonts_dir = "public/fonts"

output_style = :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
color_output = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass css scss && rm -rf sass && mv scss sass