// 縦のマス
var vartical = 20;
//横のマス
var horizontal = 20;
//真ん中の場所の2つの数字を用意
var central_vartical = Math.round(vartical / 2);
var central_horizontal = Math.round(horizontal / 2);

// 左から真ん中までは減っていく、真逆の数字を反対に入れる
// 上記を縦の回数繰り返すただ、端の数字は減らしたい

var evalu_data = [];

var data = [];

var temp_data = [];
var temp_data2 = [];
var max_evalue = 500;

//左上の済、最大の評価値

for (var i = 0; i < vartical; i++) {
  var data = [];
  for (var j = 0; j < horizontal; j++) {
    data.push(max_evalue);
    max_evalue *= -0.8;
    if (j == central_horizontal - 1) {
      temp_data = data.toReversed();
      data = data.concat(temp_data);
      break;
    }
  }
  evalu_data[i] = data;
}

//   evalu_data[i] = data;
console.log(evalu_data);
