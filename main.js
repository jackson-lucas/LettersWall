media = $('audio');

media[0].addEventListener('progress', function()
{

  var ranges = [], i, j;
  for(j = 0; j < media.length; j++) {
      for(i = 0; i < media[j].buffered.length; i ++)
      {
        ranges.push([
          media[j].buffered.start(i),
          media[j].buffered.end(i)
          ]);
        console.log(ranges);
      }
    }

}, false);