'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');
const gm = require('gulp-gm');
const imagemin = require('gulp-imagemin');
const fs = require('fs');
const exec = require('child_process').exec;

const ORIGINAL_IMG_DIR = '../../static/unprocessed/';
const STATIC_IMG_DIR = '../../static/img/';

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
  gulp.src(ORIGINAL_IMG_DIR + '*/*.jpg')
    .pipe(gm((gmfile, done) => {
      gmfile.size((err, size) => {
        let orientation = size && size.height >= size.width ? 'vertical' : 'horizontal';
        done(null, gmfile.resize(
          DIMENSIONS[orientation].width,
          DIMENSIONS[orientation].height
        ));
      })
    }))
    .pipe(imagemin())
    .pipe(gulp.dest(STATIC_IMG_DIR));
});

gulp.task('pages', _ => {
  let jpegs = walkSync(STATIC_IMG_DIR)
    .filter(f => f.match(/.jpg/))
    .map(j => {
      let arr = j.replace(STATIC_IMG_DIR, '').split('/');
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
