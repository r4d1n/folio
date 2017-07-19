'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');
const gm = require('gulp-gm');
const imagemin = require('gulp-imagemin');
const fs = require('fs');
var exec = require('child_process').exec;

const PATH_TO_IMAGES = '../../static/unprocessed/';
const IMG_DEST = '../../static/img/';

const DIMENSIONS = {
  vertical: {
    height: 750,
    width: 500
  },
  horizontal: {
    height: 500,
    width: 750
  }
}

const walkSync = (dir, filelist) => {
  let names = fs.readdirSync(dir);
  var filelist = filelist || [];
  names.forEach(function (file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    } else {
      filelist.push(dir + file);
    }
  });
  return filelist;
};

gulp.task('resize', _ => {
  gulp.src(PATH_TO_IMAGES + '*/*.jpg')
    .pipe(gm((gmfile, done) => {
      gmfile.size((err, size) => {
        let orientation = size.height >= size.width ? 'vertical' : 'horizontal';
        done(null, gmfile.resize(
          DIMENSIONS[orientation].width,
          DIMENSIONS[orientation].height
        ));
      })
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(IMG_DEST));
});

gulp.task('pages', _ => {
  let jpegs = walkSync(PATH_TO_IMAGES)
    .filter(f => f.match(/.jpg/))
    .map(j => {
      let arr = j.replace(PATH_TO_IMAGES, '').split('/');
      return {
        project: arr[0],
        image: arr[1]
      }
    })
    .map(j => {
      return new Promise((resolve, reject) => {
        exec(`hugo new ${j.project}/${j.image.replace('jpg', 'md')} --kind image`, {
          cwd: '../../'
        },
          (err, stdout, stderr) => {
            if (err) reject(err);
            resolve(stdout);
          });
      })
    });

  return Promise.all(jpegs);
});

gulp.task('default', _ => {
  console.log('no default task');
});
