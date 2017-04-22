var React = require('react');
var ReactDOM =  require('react-dom');

var Dialog = require('../base/Dialog.react');
var TabGroup = require('../base/TabGroup.react');
var Uploader = require('../../utils/FileUpload');

class ImageUpload extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			images:[],
			dragEnter:false
		}
	}
	handleUploadFile(obj){
		/**
		 * 点击 obj = e.target
		 * 拖拽 obj = e.dataTransfer
		 */
		var _self = this;
		var images = this.state.images;
		var request = this.props.request;
		var mask = ReactDOM.findDOMNode(this.refs.mask);
		var uploader = this.props.customUploader? this.props.customUploader: Uploader;

		var files = obj.files;
		var fileIndex = 0;
		single(files[fileIndex]);

		function single(file){
			uploader.uploadFile({
					file:file,
					filename:_self.props.name,
					url:_self.props.url,
					type:_self.props.type,
				    qiniu:_self.props.qiniu,
					onLoad:function(e){
						mask.style.display = "block";
						mask.innerHTML = `${fileIndex + 1}/${files.length} Uploading...`;
					},
					onSuccess:function(res){
						// console.log(`2文件总数：${files.length}`);
						mask.style.display = "block";
						mask.innerHTML = "Load Success";

						if(res && res.status=="success"){
							images.push({
								src: res.data[request || "image_src"]
							})
							_self.setState({
								images:images
							})
							if(_self.props.onChange){
								_self.props.onChange(0,images);
							}
							// console.log(`3文件总数：${files.length}`);
						}

						setTimeout(function(){

							if(fileIndex + 1 < files.length){
								//判断是否还有图片没有上传
								fileIndex += 1;
								single(files[fileIndex]);
							}else{
								//去除遮罩层
								mask.style.display = "none";
								//图片上传完毕，重置文件索引 fileIndex
								fileIndex = 0;
								if(!obj.dropEffect){
									// console.log('done')
									// clear value
									obj.value = "";
								}
							}
						},200)
					},
					onError:function(e){
						mask.style.display = "block";
						mask.innerHTML = "Load Error";
						setTimeout(function(){
							mask.style.display = "none";
						},200)
					}
				});
		}
	}
	handleChange(e){
		e = e || event;
		var target = e.target || e.srcElement;
		if(target.files.length>0){
			this.handleUploadFile(target)
			// clear value
			// target.value = "";
		}
	}
	getImages(){
		return this.state.images;
	}
	clearImages(){
		this.setState({
			images:[]
		})
	}
	handleRemoveImage(e){
		e = e || event;
		var target = e.target || e.srcElement;
		var index = parseInt(target.getAttribute("data-index"));
		var images = this.state.images;
		images.splice(index,1);
		this.setState({
			images:images
		})
		if(this.props.onChange)
			this.props.onChange(0,images);
	}
	handleDrop(e){
		e.preventDefault();
		var files = e.dataTransfer.files;
		if(files.length>0){
			// this.handleUploadFile(files[0]);
			this.handleUploadFile(e.dataTransfer);
		}
		this.setState({
			dragEnter:false
		})
		// console.log(e.type);
	}
	handleDragOver(e){
		e.preventDefault();
		// console.log(e.type);
	}
	handleDragEnter(e){
		this.setState({
			dragEnter:true
		})
		// console.log(e.type);
	}
	handleDragLeave(e){
		this.setState({
			dragEnter:false
		})
		// console.log(e.type);
	}
	render(){
			var images = this.state.images;
			var dragEnter = this.state.dragEnter;
			var handleRemoveImage = this.handleRemoveImage.bind(this);
			var action = this.props.action?this.props.action:"/upload";
			var showStyle = {
				"display":"block"
			}
			var hideStyle = {
				"display":"none"
			}

			var hasImages = images.length > 0;
			return (<div className="tab-panel">
						<div className={"image-content" +(dragEnter?" drag-enter":"")}  onDrop={this.handleDrop.bind(this)}
									onDragOver={this.handleDragOver.bind(this)}
									onDragEnter={this.handleDragEnter.bind(this)}
									onDragLeave={this.handleDragLeave.bind(this)}
									onDragEnd={this.handleDragLeave.bind(this)}
									onDragStart={this.handleDragEnter.bind(this)}>
							{
								images.map(function(ele,pos){
									return (<div className="image-item">
														<div className="image-close" data-index={pos} onClick={handleRemoveImage}></div>
														<img src={ele.src} className="image-pic" height="75" width="120" />
										</div>)
							   })
							}
							<div className="image-upload2" style={ hasImages?showStyle:hideStyle }>
								<span className="image-icon"></span>
								<form className="image-form"  method="post" encType="multipart/form-data" target="up" action={action} >
									<input onChange={this.handleChange.bind(this)} multiple="multiple" style={{ filter: "alpha(opacity=0)" }} className="image-file" type="file"  name="file" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp" />
								</form>
							</div>
						</div>
						<div className="image-dragTip" style={ hasImages?hideStyle:showStyle }>支持图片拖拽上传</div>
						<div className="image-upload1" style={ hasImages?hideStyle:showStyle }>
							<span className="image-icon"></span>
							<form className="image-form" method="post" encType="multipart/form-data" target="up" action={action} >
								<input onChange={this.handleChange.bind(this)} multiple="multiple" style={{ filter:"alpha(opacity=0)"}} className="image-file" type="file"  name="file" accept="image/gif,image/jpeg,image/png,image/jpg,image/bmp" />
							</form>
						</div>
						<div className="image-mask" ref="mask">
								{"Loading...."}
						</div>
					</div>)
	}
}

class ImageSearch extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			images:[]
		}
	}
	getImages(){
		return this.state.images;
	}
	clearImages(){
		this.setState({
			images:[]
		})
	}
	handleClick(e){
		var text = ReactDOM.findDOMNode(this.refs.text);
		var src = text.value;
		var images = this.state.images;
		if(src && src.length>0){
			images.push({src})
			this.setState({
				images:images
			})
			if(this.props.onChange)
				this.props.onChange(1,images);
			text.value = "";
		}
	}
	handleRemoveImage(e){
		e = e || event;
		var target = e.target || e.srcElement;
		var index = parseInt(target.getAttribute("data-index"));
		var images = this.state.images;
		images.splice(index,1);
		this.setState({
			images:images
		})
	}
	render(){
		var images = this.state.images;
		var handleRemoveImage = this.handleRemoveImage.bind(this);
		return (<div className="tab-panel">
				<table className="search-bar">
					<tbody>
							<tr>
								<td>
										<input className="image-searchTxt" type="text" ref="text" />
								</td>
								<td>
										<div className="image-searchAdd" onClick={this.handleClick.bind(this)}>添加</div>
								</td>
							</tr>
					</tbody>
				</table>
				<div className="image-content">
						{
							images.map(function(ele,pos){
								return (<div key={pos} className="image-item">
													<div className="image-close" data-index={pos} onClick={handleRemoveImage}></div>
													<img src={ele.src} className="image-pic" height="75" width="120"  />
									</div>)
						   })
						}
				</div>
			</div>)
	}
}

class ImageDialog extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			images:[[],[]],
			handle:function(){}
		}
	}
	open(handle){
		this.setState({
			handle:handle
		})
		this.refs.modal.open();
	}
	close(){
		if(this.refs.modal){
			this.refs.modal.close();
			if(this.state.handle){
				this.state.handle();
				this.setState({
					handle:null
				})
			}
			this.refs.image.clearImages();
		}
	}
	toggle(handle){
		this.setState({
			handle:handle
		})
		this.refs.modal.toggle();
	}
	handleOkClick(e){
		// 做相应的处理
		var tabIndex = this.refs.tab.getTabIndex();
		var images = this.state.images[tabIndex];
		var strImgs = "";
		if(images.length>0 && this.state.handle){
			for(var i=0;i<images.length;i++){
				var src = images[i].src;
				var str = "<img width='100%' src='"+src+"' />";
				strImgs += str;
			}
			this.state.handle(e,strImgs);
		}
		this.close();
	}
	handleChange(index,imgs){
		var images = this.state.images;
		images[index] = imgs;
		this.setState({
			images:images
		})
	}
	render(){
		var uploader = this.props.uploader;
		var buttons = [
			{ name:"btn-ok", content:"确定", onClick:this.handleOkClick.bind(this)},
			{ name:"btn-cancel", content:"取消", onClick:this.close.bind(this)}
		];
		var tabs = [
			{title:"本地上传",component:(<ImageUpload ref="image" onChange={this.handleChange.bind(this)} request={ uploader.request } type={uploader.type} name={uploader.name} url={uploader.url} qiniu={uploader.qiniu}/>)},
			{title:"网络图片",component:(<ImageSearch ref="image" onChange={this.handleChange.bind(this)}/>)},
		]
		if(this.props.hidden){
			return (<div></div>)
		}else{
			return (<Dialog ref="modal" className="image-dialog" width={700} height={508} title="图片" buttons={buttons} onClose={this.close.bind(this)}>
					<TabGroup tabs={tabs} ref="tab"/>
				</Dialog>)
		}
	}
}

ImageDialog.propTypes = {
		uploader:React.PropTypes.object,
		customUploader:React.PropTypes.object
}
ImageDialog.defaultProps = {
	uploader:{
		type:"default", // qiniu
		name:"file",
		url:"/upload",
		request: "image_src",
		qiniu:{
			app:{
				bucket: "qtestbucket",
				ak: "iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV",
				sk: "6QTOr2Jg1gcZEWDQXKOGZh5PziC2MCV5KsntT70j"
			},
			key:null,
			upload_token:null
		}
	}
}

module.exports = ImageDialog;
