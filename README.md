# AzurLane-Live2D-Viewer
## 說明
實現碧藍L2D開場動畫、觸摸動畫  
外加背景圖片跟縮放功能(良心  

## 拆包
我用的是Asset Studio的民間版本：[AssetStudioMod](https://github.com/aelurum/AssetStudio)

而且聽說UnityLive2DExtractor拆不出來，AssetStudio也不會再更新  
所以跳槽了  
這個版本拆出來的品質好太多

## 展示網頁操作說明
- 滾輪縮放
- 滑鼠中鍵重新定位Model
- 左鍵可拖曳Model
- Model名稱都是漢拼，請自行想像(?
- 背景、Model載入時間較久，勿噴
- 有Cookie記錄，我才不管你接不接受

## 心得
HitArea如何實現困擾我很久，爬文也沒有東西  

原本想參考這位大佬:  
https://l2d.algwiki.moe/  
https://gitgud.io/alg-wiki/azurlanel2dviewer  
直接轉換vertices座標，結果發現技術含量過高，我玩不起  

之後去pixi-live2d導出的model中找找，在`model.internalModel.coreModel._drawableIds`中找到TouchSpecial、TouchBody、TouchHead這三個Id  
突發奇想丟到hitarea看看，成了  

再來就是把想法擴展到更多的HitAreas，另外我也放了更多背景圖片  
版本是日版(目前最新)，拆包拆出來一定有瑕疵，手變兩條腳變三條之類的，請不要噴我  

可以使用根目錄下的`add_hitareas.py`來自動加入HitAreas

## TODO

1. 實裝Q版人物圖示
2. 加個關於頁面

## 有bug歡迎提出
