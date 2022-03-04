export default class ObjectUtils {

    constructor() {
       
    }

    objToStr(obj) {
        return Object.entries(obj)
            .map(v => {
                v[0] = v[0].toUpperCase();
                return '* ' + v.join(': ');
            })
            .join('\n');
    }

    // Function: createNestedObject( base, names[, value] )
    //   base: the object on which to create the hierarchy
    //   names: an array of strings contaning the names of the objects
    //   value (optional): if given, will be the last object in the hierarchy
    // Returns: the last object in the hierarchy
    createNestedObject(base, names, value) {
        // If a value is given, remove the last name and keep it for later:
        var lastName = arguments.length === 3 ? names.pop() : false;

        // Walk the hierarchy, creating new objects where needed.
        // If the lastName was removed, then the last object is not set yet:
        for (var i = 0; i < names.length; i++) {
            base = base[names[i]] = base[names[i]] || {};
        }

        // If a value was given, set it to the last name:
        if (lastName) base = base[lastName] = value;

        // Return the last object in the hierarchy:
        return base;
    };

    getIsFunctionInInNestedObj(obj, url) {
        let v = this.getValueInNestedObj(obj, url);
        return typeof v === 'function';
    }

    getKeysInNestedObj(obj, url) {
        let v = this.getValueInNestedObj(obj, url);
        return Object.keys(v);
    }

    getValueInNestedObj(obj, url) {
        let urlArr = url.split("/");
        console.log('urlArr', urlArr);
        if (urlArr.length == 0) return obj;
        if (urlArr.length == 1 && urlArr[0] == '') return obj;

        let result = urlArr.reduce(
            (p, c) => p[c] ?? {}, obj
        );
        return result;
    }

    getResultMapByCmd = (input) => {
        var regex =
            /'[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+'|"[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+"|[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩]+/gi;
        var regexArr = input.trim().match(regex) ?? [];

        let totalArr = [];
        let curArr = [];
        regexArr.forEach(v => {
            if (v[0] == "-") {
                totalArr.push(curArr);
                curArr = [];
                curArr.push(v);
            } else {
                curArr.push(v);
            }
        });
        totalArr.push(curArr);

        let resultMap = {};
        resultMap["param"] = {};
        resultMap["url"] = totalArr.shift().join("/");
        resultMap["url-arr"] = resultMap["url"].split("/");
        totalArr.forEach(v => {
            resultMap.param[v.shift()] = v;
        });

        return resultMap;
    };

}
