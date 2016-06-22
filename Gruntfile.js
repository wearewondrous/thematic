// update to your environment
var proxy = 'drupal-8-1-2-theming-demo.dd:8083';

module.exports = function(grunt) {
  'use strict';

  // Load Grunt tasks automatically
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    // help jit find the tasks with alias
    svgcss: 'grunt-svg-css'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          'css/ckeditor-iframe.css': 'sass/ckeditor-iframe.scss',
          'css/styles.css': 'sass/styles.scss'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 2 versions', 'ie 11']}),
          require('cssnano')({
            zindex: false,        // do not recalculate z-indexes
            reduceIdents: false   // optional: do not compress keyframe names
          })
        ]
      },
      dist: {
        files: {
          'css/styles.min.css': 'css/styles.css'
        }
      }
    },
    uglify: {
      options: {
        preserveComments: true,
        sourceMap: true,
        screwIE8: true
      },
      dist: {
        files: {
          'js/scripts.min.js': [
            'js-src/vendors/owl.carousel.js',
            'js-src/_owl-carousel-init.js'
          ]
        }
      }
    },
    svgcss: {
      options: {
        // Task-specific options go here.
        eol: 'lf',
        insertfinalnewline: true,
        previewhtml: null // preview html file to be rendered.
      },
      backgrounds: {
        options: {
          csstemplate: 'grunt-templates/svgcss/variables.hbs'
        },
        files: {
          'sass/custom/_backgrounds.scss': ['svg-src/backgrounds/dist/*.svg']
        }
      }
    },
    svgmin: {
      options: {
        plugins: [
          {
            removeViewBox: false
          }, // don't remove the viewbox atribute from the SVG
          {
            removeUselessStrokeAndFill: false
          } // don't remove Useless Strokes and Fills
        ]
      },
      backgrounds: {
        expand: true,
        cwd: 'svg-src/backgrounds',
        src: ['*.svg'],
        dest: 'svg-src/backgrounds/dist',
        ext: '.svg'
      }
    },
    // BrowserSync
    // http://localhost:3000
    browserSync: {
      src: {
        bsFiles: {
          src : [
            'css/*.min.css',
            'js/*.min.js',
            'assets/**/*',
            'templates/**/*.twig'
          ]
        },
        // http://www.browsersync.io/docs/options/
        options: {
          proxy: proxy,
          watchTask: true,
          open: false,
          notify: true,
          injectChanges: true,
          ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
          },
          tunnel: false,
          online: false
        }
      }
    },
    watch: {
      grunt: { files: ['Gruntfile.js'] },
      uglify: {
        files: ['js-src/**/*.js'],
        tasks: ['uglify']
      },
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      backgrounds: {
        files: 'svg-src/backgrounds/*.svg',
        tasks: ['svgmin:backgrounds', 'grunticon']
      }
    }
  });

  grunt.registerTask('css', [
    'sass',
    'postcss'
  ]);
  grunt.registerTask('backgrounds', [
    'svgmin',
    'svgcss'
  ]);
  grunt.registerTask('default', [
    'backgrounds', // uncomment to run phantom js every time
    'css',
    'uglify',
    'browserSync',
    'watch'
  ]);
};
