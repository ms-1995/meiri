(function(){
	var classes = ['热点','国内','国际','社会','军事','财经','时尚','科技','体育'];
	var todoText = [];
	var info = [];
	for(var value of classes){
		todoText.push({'text':value});
	}
	var vue = new Vue({
		el: '#vue',
		data: {
			todos1: todoText,
			todos2: [],
			title: '',
			text: ''
		},
		mounted(){
			this.getTitle(0);
		},
		methods: {
			getClass:function(e){
				var num = e.target.title;
				this.getTitle(num);
			},
			getInfo:function(e){
				var title = e.target.innerText;
				var text = "";
				for(var i in info){
					if(info[i].title.replace(/^\s+|\s+$/g,"")===title.replace(/^\s+|\s+$/g,"")){
						text = info[i].text;
					}
				}
				console.log(text);
				this.todos2 = [];
				this.title = title;
				this.text = text;
			},
			getTitle: function(type) {
				this.$http.get('/getData?type='+type).then(function(response){
					var title = [];
					info = response.body;
					for(var value of response.body){
						title.push({'title':value.title});
					}
					this.title = '';
					this.text = '';
					this.todos2 = title;
				})
				.catch(function(error){
					console.log(error);
				})
			}
		}
		
	});
})();

