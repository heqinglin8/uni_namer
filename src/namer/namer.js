import $ from 'jquery';
import { log } from './debugTools';
import rand from './rand';
import { debugMode } from './config';
const tryNumMax = 3; //重试次数

class Namer {
  constructor() {
    this.loading = false;
    this.bookMap = null
  }

  // TODO
  formatStr(str) {
    // const res = str.replace(/[\s　 ]/g, '');
    let res = str.replace(/(\s|　|”|“){1,}|<br>|<p>|<\/p>/g, '');
    res = res.replace(/\(.+\)/g, '');
    return res;
  }

  splitSentence(content) {
    if (!content) {
      return [];
    }
    let str = this.formatStr(content);
    str = str.replace(/！|。|？|；/g, s => `${s}|`);
    str = str.replace(/\|$/g, '');
    let arr = str.split('|');
    arr = arr.filter(item => item.length >= 2);
    return arr;
  }

  // 清除标点符号
  cleanPunctuation(str) {
    const puncReg = /[<>《》！*\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g;
    return str.replace(puncReg, '');
  }

  cleanBadChar(str) {
    const badChars = '胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱'.split('');
    return str.split('').filter(char => badChars.indexOf(char) === -1).join('');
  }

  genName(id = 'all') {
    if (!this.bookMap) {
      return null;
    }
    const books = this.bookMap.get(id)
    try {
      // console.log('genName id=' + id+',book='+books)
      const passage = rand.choose(books);

      const { content, title, author, book, dynasty } = passage;
      console.log('title=' + title+',author=' + author +',book=' + book +',dynasty=' + dynasty,'genName content='+ content);

      if (!content) {
        return null;
      }

      const sentenceArr = this.splitSentence(content);

      if (!(Array.isArray(sentenceArr) && sentenceArr.length > 0)) {
        return null;
      }

      // if (Array.isArray(sentenceArr) && sentenceArr.length <= 0) {
      //   log({ passage, sentenceArr });
      // }

      const sentence = rand.choose(sentenceArr);

      const cleanSentence = this.cleanBadChar(this.cleanPunctuation(sentence));
      if (cleanSentence.length <= 2) {
        return null;
      }

      // log({ content, sentence });
      // const charList = this.cleanBadChar(cleanSentence);
      const name = this.getTwoChar(cleanSentence.split(''));
      const nameGrop = name.split('');
      const res = {
        name,
        nameGrop,
        sentence,
        content,
        title,
        author,
        book,
        dynasty,
      };
      return res;
    } catch (err) {
      console.log('genName err ='+err)
      log(err);
    }
    // log(res);
    // log('passage', passage);
  }

  getTwoChar(arr) {
    const len = arr.length;
    const first = rand.between(0, len);
    let second = rand.between(0, len);
    let cnt = 0;
    while (second === first) {
      second = rand.between(0, len);
      cnt++;
      if (cnt > 100) {
        break;
      }
    }
    return first <= second ? `${arr[first]}${arr[second]}` : `${arr[second]}${arr[first]}`;
  }

  loadBook(bookName, cb) {
    const url = `../../../static/json/${bookName}.json`;
    this.loading = true;
    $.ajax({
      url:url,
      success: (data) => {
        log(`${bookName} loaded`);
        this.loading = false;
        if(data){
          if(!this.bookMap){
            this.bookMap = new Map()
          }
          this.bookMap.set(bookName, data)
        }
       
        var allBook = []
        const bookMap = this.bookMap
        bookMap.forEach(function(value,key){
            if(key != 'all'){
              allBook = allBook.concat(value)
            }
         });
        this.bookMap.set('all', allBook)
        if (typeof cb === 'function') {
          cb(data);
        }
      },
      fail: err => {
        log(err)
        console.log('loadBook fail book = '+book)
      },
    });
  }

  getNames(id, n){
    const nameList = [];
    if(n<=0){
       return nameList
    }
    for (let i = 0; i < n; i++) {
        var nameObj = this.genName(id);
        var tryNum = tryNumMax;
        while(nameObj == null && tryNum > 0){
            nameObj = this.genName(id);
            tryNum --
        }
        // console.log('getNames nameObj = '+JSON.stringify(nameObj));
        nameList.push(nameObj);
    }

    return nameList
  }

}
export default Namer;
