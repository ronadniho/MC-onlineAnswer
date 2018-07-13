<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>


  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import 'variable';
  @import 'mui';
  html, body {
    padding: 0;
    margin: 0;
    height: @max;
    width: @max;
  }

  ul, ol, dl, dd, p, h1, h2, h3, h4, h5, h6 {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #app {
    height: @max;
  }

  .lt {
    float: left;
  }

  .rt {
    float: right;
  }

  .clr {
    content: '';
    display: table;
    clear: both;
  }

  .flex {
    display: flex;
    flex-flow: row nowrap;
    display: -webkit-box;      /* OLD - iOS 6-, Safari 3.1-6 */
    display: -moz-box;         /* OLD - Firefox 19- (buggy but mostly works) */
    display: -ms-flexbox;      /* TWEENER - IE 10 */
    display: -webkit-flex;     /* NEW - Chrome */
  }

  .flex-align-center {
    align-items: center;
  }

  .flex-justify-center {
    justify-content: center;
  }
</style>

