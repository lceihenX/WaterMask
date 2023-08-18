import {
  Card,
  Button,
  Upload,
  Space,
  message,
  Switch,
  Input,
  InputNumber,
  Tooltip,
} from "antd";
import { UploadOutlined, CloudDownloadOutlined } from "@ant-design/icons";

import { useRef, useState } from "react";
import { useEffect } from "react";
import {
  handleConbinatePngCanvasData,
  handleReTransformPngData,
} from "./utils";
import styles from "./index.module.less";

const CANVAS_DEFAULT_CONFIG = {
  text: "xCurrency hubs",
  count: 4,
  fontSize: "30",
  fontFamily: "Microsoft Yahei",
  previewStatus: true,
  maskWorkStatus: true,
  rotate: 0,
};

const WaterMask = () => {
  const canvasRef = useRef(null);

  const textCanvasRef = useRef(null);

  const [canvasRefContext, setCanvasRefContext] = useState(null);

  const [textCanvasRefContext, setTextCanvasRefContext] = useState(null);

  const [selectFile, setSelectFile] = useState(null);

  const [textCanvasData, setTextCanvasData] = useState(null);

  const [colorPosition, setColorPosition] = useState("R");

  const [canvasConfig, setCanvasConfig] = useState({
    ...CANVAS_DEFAULT_CONFIG,
    ...(JSON.parse(localStorage.getItem("canvasConfig")) || {}),
  });

  useEffect(() => {
    localStorage.setItem("canvasConfig", JSON.stringify(canvasConfig));
  }, [canvasConfig]);

  useEffect(() => {
    setCanvasRefContext(canvasRef.current?.getContext("2d"));
  }, []);

  useEffect(() => {
    const { fontSize, fontFamily, text, count, rotate } = canvasConfig;
    const context = textCanvasRef.current?.getContext("2d");
    setTextCanvasRefContext(context);
    if (canvasConfig.maskWorkStatus) {
      context.font = `${fontSize}px ${fontFamily}`;

      let widthWrap = canvasRef.current.width / count;
      let heightWrap = canvasRef.current.height / count;

      // context.rotate(-rotate - 180);
      console.log("widthWrap", widthWrap);
      console.log("heightWrap", heightWrap);

      for (let i = 1; i <= count; i++) {
        context.fillText(text, i * widthWrap * 0.5, i * heightWrap * 0.5);
      }

      // context.rotate(rotate + 180);
      const currentTextCanvasData = context.getImageData(
        0,
        0,
        textCanvasRef.current.width,
        textCanvasRef.current.height
      );
      setTextCanvasData(currentTextCanvasData);
      console.log("currentTextCanvasData", currentTextCanvasData);
    }
  }, [selectFile]);

  const reTransformData = (originalData) => {
    let data = originalData.data;
    handleReTransformPngData(data);
  };

  const onChange = (selectOption) => {
    console.log("selectOption", selectOption);
    const { file } = selectOption || {};
    if (!file) return;

    const image = new Image();
    image.onload = () => {
      const imageWidth = image.width;
      const imageHeight = image.height;

      canvasRef.current.width = imageWidth;
      canvasRef.current.height = imageHeight;

      textCanvasRef.current.width = imageWidth;
      textCanvasRef.current.height = imageHeight;

      canvasRefContext.clearRect(0, 0, imageWidth, imageHeight);

      textCanvasRefContext.clearRect(0, 0, imageWidth, imageHeight);

      canvasRefContext.drawImage(image, 0, 0);

      const processData = canvasRefContext.getImageData(
        0,
        0,
        imageWidth,
        imageHeight
      );
      setSelectFile(file.originFileObj);
      console.log(canvasConfig.maskWorkStatus);
      if (!canvasConfig.maskWorkStatus) {
        reTransformData(processData);
        canvasRefContext.clearRect(0, 0, imageWidth, imageHeight);

        console.log("clearRect");

        canvasRefContext.putImageData(processData, 0, 0);
      }
      console.log(processData.data);
    };
    const reader = new FileReader();
    reader.onload = function (event) {
      image.src = event.target.result;
    };

    reader.readAsDataURL(file.originFileObj);
  };
  const handleDownload = () => {
    console.log("selectFile", selectFile);
    if (!selectFile) {
      message.warning("请先加载文件");
      return;
    }

    transformData();
    const { name } = selectFile;
    const viewData = canvasRef.current?.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = viewData;
    link.download = name;
    link.click();
  };
  const transformData = () => {
    console.log("canvasRefContext", canvasRefContext);
    let imageDataObject = canvasRefContext.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const imageData = imageDataObject.data;
    let attachData = textCanvasData.data;

    handleConbinatePngCanvasData(imageData, attachData, colorPosition);

    canvasRefContext.putImageData(imageDataObject, 0, 0);
  };
  return (
    <section>
      <Card>
        <Space direction="vertical" size={"large"}>
          <Space>
            <Upload onChange={onChange} fileList={[]}>
              <Button type="primary" icon={<UploadOutlined />}>
                Select Image
              </Button>
            </Upload>
            <Tooltip title="only real-png support">
              <Button
                type="primary"
                icon={<CloudDownloadOutlined />}
                onClick={handleDownload}
                disabled={!canvasConfig.maskWorkStatus}
              >
                Down Load
              </Button>
            </Tooltip>

            <Switch
              checkedChildren="加水印"
              unCheckedChildren="解水印"
              defaultChecked={canvasConfig.maskWorkStatus}
              onChange={(status) =>
                setCanvasConfig({
                  ...canvasConfig,
                  maskWorkStatus: status,
                })
              }
            />

            {/* <Switch
              checkedChildren="预览"
              unCheckedChildren="原图"
              defaultChecked={canvasConfig.previewStatus}
              onChange={(status) => {
                setCanvasConfig({
                  ...canvasConfig,
                  previewStatus: status,
                });
              }}
            /> */}
          </Space>

          <Space>
            <label>隐写文本:</label>
            <Input
              placeholder="请输入隐写文本"
              onChange={(event) =>
                setCanvasConfig({
                  ...canvasConfig,
                  text: event.target.value,
                })
              }
              defaultValue={canvasConfig.text}
            />
            <label>隐写文本个数:</label>
            <InputNumber
              min="1"
              placeholder="请输入隐写文本"
              onChange={(value) =>
                setCanvasConfig({
                  ...canvasConfig,
                  count: value,
                })
              }
              defaultValue={canvasConfig.count}
            />
            {/* <label>旋转角度:</label>
            <InputNumber
              min=""
              placeholder="请输入旋转角度"
              onChange={(value) =>
                setCanvasConfig({
                  ...canvasConfig,
                  rotate: value,
                })
              }
              defaultValue={canvasConfig.rotate}
            /> */}
          </Space>
        </Space>
      </Card>
      <article className={styles.canvas_contain}>
        <canvas width={600} height={600} ref={canvasRef}></canvas>
        <canvas
          width={600}
          height={600}
          ref={textCanvasRef}
          className={styles.text_canvas_contain}
        ></canvas>
      </article>
    </section>
  );
};
export default WaterMask;
