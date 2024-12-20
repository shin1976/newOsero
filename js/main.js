﻿"use strict";
{
  var data = [];
  var BLACK = 1;
  var WHITE = 2;
  var myTurn = false;
  var timeoutID;
  var timeoutID2;

  //縦のマスの数
  var vertical = 15;
  //横のマスの数
  var horizontal = 15;
  //真ん中の場所の2つの数字を用意
  var central_vertical = Math.round(vertical / 2);
  var central_horizontal = Math.round(horizontal / 2);

  //ここだけ変更すれば大丈夫
  // var WeightData = [
  //   [50, 50, 45, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  //   [50, 50, -11, -16, -1, -3, -3, 2, -16, -11, 50, 50],
  //   [50, 50, 4, -1, 2, -1, -1, 2, -1, 4, 50, 50],
  //   [50, 50, -1, -3, -1, 0, 0, -1, -3, -1, 50, 50],
  //   [50, 50, -1, -3, -1, 0, 0, -1, -3, -1, 50, 50],
  //   [50, 50, 4, -1, 2, -1, -1, 2, -1, 4, 50, 50],
  //   [50, 50, -11, -16, -1, -3, -3, -1, -16, -11, 50, 50],
  //   [50, 50, 30, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  //   [50, 50, 30, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  //   [50, 50, 30, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  //   [50, 50, 30, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  //   [50, 50, 30, -11, 4, -1, -1, 4, -11, 45, 50, 50],
  // ];

  //評価基準を自動生成する関数
  function make_evalue() {
    var evalu_data = [];
    var data = [];
    var temp_data = [];
    var max_evalue = 500;
    //左上の済、最大の評価値
    for (var i = 0; i < vertical; i++) {
      // var max_evalue = 500;
      // var data = [];
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
    return evalu_data;
  }
  var WeightData = make_evalue();

  //ゲームを開始状態にする関数
  function init() {
    var b = document.getElementById("board");
    for (var i = 0; i < vertical; i++) {
      var tr = document.createElement("tr");
      data[i] = [];
      for (var t = 0; t < vertical; t++) {
        data[i].push(0);
      }
      // console.log(data)
      // data[i] = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var j = 0; j < horizontal; j++) {
        var td = document.createElement("td");
        td.className = "cell";
        td.id = "cell" + i + "_" + j;
        // 属性を追加
        td.setAttribute("ve", i);
        td.setAttribute("hi", j);
        td.onclick = clicked;
        tr.appendChild(td);
      }
      b.appendChild(tr);
    }
    put(central_vertical, central_horizontal, BLACK);
    put(central_vertical - 1, central_horizontal - 1, BLACK);
    put(central_vertical, central_horizontal - 1, WHITE);
    put(central_vertical - 1, central_horizontal, WHITE);

    update();
  }

  function showMessage(str) {
    document.getElementById("message").textContent = str;
    timeoutID2 = setTimeout(function () {
      document.getElementById("message").textContent = "";
    }, 2000);
  }
  //駒を置く
  function put(i, j, color) {
    var c = document.getElementById("cell" + i + "_" + j);
    c.textContent = "●";
    c.className = "cell " + (color == BLACK ? "black" : "white");
    data[i][j] = color;
  }

  //それぞれが駒を置くたびに、盤面をアップデートする
  function update() {
    //全ての升目の白と黒の数を駒を数える
    var numWhite = 0,
      numBlack = 0;
    for (var x = 0; x < vertical; x++) {
      for (var y = 0; y < horizontal; y++) {
        if (data[x][y] == WHITE) {
          numWhite++;
        }
        if (data[x][y] == BLACK) {
          numBlack++;
        }
      }
    }
    //黒と白の数を盤面の上に表示する
    document.getElementById("numBlack").textContent = numBlack;
    document.getElementById("numWhite").textContent = numWhite;

    //黒、白の駒に置く場所があるかを調べる
    var blackFlip = canFlip(BLACK);
    var whiteFlip = canFlip(WHITE);
    //駒が全て置かれている、もしくは、白黒共に置く場所がない場合は終了
    if (
      numWhite + numBlack == vertical * horizontal ||
      (!blackFlip && !whiteFlip)
    ) {
      showMessage("ゲームオーバー");
      clearTimeout(timeoutID);
      clearTimeout(timeoutID2);
    } else if (!blackFlip) {
      showMessage("黒スキップ");
      myTurn = false;
    } else if (!whiteFlip) {
      showMessage("白スキップ");
      myTurn = true;
    } else {
      //順番を変える
      myTurn = !myTurn;
    }
    if (!myTurn) {
      //1秒待って、think関数を動かす
      timeoutID = setTimeout(think, 1000);
    }
  }

  //自分がクリックしたときの処理

  function clicked(e) {
    //pc考え中はタッチできない
    if (!myTurn) {
      return;
    }
    //クリックした場所のidをもらってくる
    // var id = e.target.id;
    //parseIntで文字列を整数に変換
    //charAtでcell00の5、6文字目の数字を取得
    // var i = parseInt(id.charAt(4));
    // var j = parseInt(id.charAt(5));
    // console.log(e.target.attributes);
    var ve = e.target.attributes.ve.value;
    var hi = e.target.attributes.hi.value;
    var i = parseInt(ve);
    var j = parseInt(hi);
    // console.log(typeof i);
    //i,jに置いたときに裏返せる升目の情報を配列でもらってくる
    var flipped = getFlipCells(i, j, BLACK);
    if (flipped.length > 0) {
      for (var k = 0; k < flipped.length; k++) {
        put(flipped[k][0], flipped[k][1], BLACK);
      }
      put(i, j, BLACK);
      update();
    }
  }

  //コンピュータ思考関数
  function think() {
    //升目の得点計算用の変数を初期化
    var highScore = -1000;
    //駒を置く予定の場所px,pyを初期化
    var px = -1;
    var py = -1;
    for (var x = 0; x < vertical; x++) {
      for (var y = 0; y < horizontal; y++) {
        //升目に白を置いた仮定で計算をするために、下書き用データをもらう
        var tmpData = copyData();
        //ある場所に白を置いたときに、裏返せる場所を配列でもらう
        var flipped = getFlipCells(x, y, WHITE);
        //裏返せる場所が1つでもあれば、
        if (flipped.length > 0) {
          for (var i = 0; i < flipped.length; i++) {
            //裏返せるデータの数だけ、データを更新していく
            var p = flipped[i][0];
            var q = flipped[i][1];
            //白に裏返った升目のデータを更新
            tmpData[p][q] = WHITE;
            //白を置いたマス目のデータを更新
            tmpData[x][y] = WHITE;
          }
          //更新されたデータを元に、全升目の白の点数を計算
          var score = calcWeightData(tmpData);
          //今回のx,yのデータを元に計算した結果の方が高ければ、px,pyにそれを入れる
          if (score > highScore) {
            highScore = score;
            px = x;
            py = y;
          }
        }
      }
    }
    if (px >= 0 && py >= 0) {
      //白を置いたときに、裏返せる升目の配列をもらう
      var flipped = getFlipCells(px, py, WHITE);
      if (flipped.length > 0) {
        for (var k = 0; k < flipped.length; k++) {
          //順番に白に色を変えていく
          put(flipped[k][0], flipped[k][1], WHITE);
        }
      }
      //最初に置いた場所も白に変える
      put(px, py, WHITE);
    }
    update();
  }

  //駒テーブルデータをコピー
  function copyData() {
    var tmpData = [];
    for (var x = 0; x < vertical; x++) {
      tmpData[x] = [];
      for (var y = 0; y < horizontal; y++) {
        tmpData[x][y] = data[x][y];
      }
    }
    return tmpData;
  }

  //挟める駒があるかを調べる(全ての升目に対してgetFlipCellsをして、一つでもあればtrueを返す)
  function canFlip(color) {
    for (var x = 0; x < vertical; x++) {
      for (var y = 0; y < horizontal; y++) {
        //colorの番だった時に、挟める駒があるかを調べる
        var flipped = getFlipCells(x, y, color);
        if (flipped.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  //canFlipの中で使う関数、ある場所に置いたときに、全ての方向に対してgetFlipCellsOneDirを行う
  function getFlipCells(i, j, color) {
    //これから調べるマス目に既に黒又は白の駒が置いてあればリターン
    if (data[i][j] == BLACK || data[i][j] == WHITE) {
      return [];
    }
    //挟める駒があるか、左上、上、右上、左、右、左下、下、右下と順番に調べる
    var dirs = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    var result = [];
    for (var p = 0; p < dirs.length; p++) {
      var flipped = getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color);
      //concatで方向を調べた結果挟めるとわかった配列を追加していく
      result = result.concat(flipped);
    }
    return result;
  }

  //駒を置ける升目か判定する関数(getFlipCells関数の中で使う関数)
  function getFlipCellsOneDir(i, j, dx, dy, color) {
    var x = i + dx;
    var y = j + dy;
    var flipped = [];
    //ある方向の升目が、盤外、同じ色、空の場合は、return
    // console.log(data);
    if (
      x < 0 ||
      y < 0 ||
      x >= vertical ||
      y >= horizontal ||
      data[x][y] == color ||
      data[x][y] == 0
    ) {
      return [];
    }
    //違う色の駒があるということは挟めるということなので、配列に追加
    flipped.push([x, y]);
    while (true) {
      x += dx;
      y += dy;
      //ある方向にもう一つ進んだ升目が、盤外、空の場合は、挟めないということなので、return
      if (
        x < 0 ||
        y < 0 ||
        x >= vertical ||
        y >= horizontal ||
        data[x][y] == 0
      ) {
        return [];
      }
      //同じ色の場合は、色を変えられるということなので、配列を返す
      if (data[x][y] == color) {
        return flipped;
      } else {
        //違う色の駒が置かれている場合は、配列にこの升目を加えて、更にもう一つ方向を進んで調べる
        flipped.push([x, y]);
      }
    }
  }

  //升目の価値計算
  function calcWeightData(tmpData) {
    var score = 0;
    for (var x = 0; x < vertical; x++) {
      for (var y = 0; y < horizontal; y++) {
        if (tmpData[x][y] == WHITE) {
          score += WeightData[x][y];
        }
      }
    }
    return score;
  }

  init();
}
