package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	// 私有仓库如果无法通过go get到，需要在Gopkg.toml中配置，
	// [[constraint]]
	//   name = "gitee.com/zengming00/testgo1.git"
	//   branch = "master"
	//   source = "git@gitee.com:zengming00/testgo1.git"

	// 因为是私有仓库，所以要加上.git
	// test "gitee.com/zengming00/testgo1.git"
	// "gitee.com/zengming00/testgo2.git"
	"github.com/zengming00/go-qps"
)

func getData() []byte {
	var data = map[string]interface{}{
		"args": os.Args,
		"env":  os.Environ(),
	}
	bts, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		panic(err)
	}
	return bts
}

/*
telnet测试
GET / HTTP/1.1
Host: 192.168.58.142:8888
Connection: keep-alive
*/
func main() {

	qp := qps.NewQP(time.Second, 100)
	http.HandleFunc("/qp", func(w http.ResponseWriter, r *http.Request) {
		qp.Count()
		str, err := qp.Show()
		if err != nil {
			panic(err)
		}
		w.Write([]byte(str))
	})

	http.HandleFunc("/qp_json", func(w http.ResponseWriter, r *http.Request) {
		qp.Count()
		bts, err := qp.GetJson()
		if err != nil {
			panic(err)
		}
		w.Write(bts)
	})

	// 此代码在telnet中是长连接的
	// 因为没有设置内容长度，传输会变成 Transfer-Encoding: chunked
	http.HandleFunc("/1", func(w http.ResponseWriter, r *http.Request) {
		w.Write(getData())
	})

	// 强行关闭长连接
	http.HandleFunc("/2", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Connection", "close")
		w.Write(getData())
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		bts := getData()
		// 因为设置了content-length，所以不再是 Transfer-Encoding: chunked
		// 响应头content-length会自动转换为规范的大小写
		w.Header().Set("ContenT-LeNgth", fmt.Sprintf("%d", len(bts)))
		w.Write(bts)
	})

	log.Fatal(http.ListenAndServe(":8888", nil))
}
