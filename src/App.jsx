import { Card, Button, Upload, Space, message, Switch } from "antd";
import { UploadOutlined, CloudDownloadOutlined } from "@ant-design/icons";

import { useRef, useState } from "react";
import { useEffect } from "react";
import {
  handleConbinatePngCanvasData,
  handleConbinateJpgCanvasData,
  handleReTransformPngData,
  handleReTransformJpgData,
} from "./utils";
import styles from "./index.module.less";
const WaterMask = () => {
  const canvasRef = useRef(null);

  const textCanvasRef = useRef(null);

  const [canvasRefContext, setCanvasRefContext] = useState(null);

  const [textCanvasRefContext, setTextCanvasRefContext] = useState(null);

  const [selectFile, setSelectFile] = useState(null);

  const [textCanvasData, setTextCanvasData] = useState(null);

  const [workStatus, setWorkStatus] = useState(true);

  const [colorPosition, setColorPosition] = useState("R");

  useEffect(() => {
    setCanvasRefContext(canvasRef.current?.getContext("2d"));
  }, []);

  useEffect(() => {
    const context = textCanvasRef.current?.getContext("2d");
    setTextCanvasRefContext(context);
    if (workStatus) {
      context.font = "30px Microsoft Yahei";
      context.fillText("hello world！", 80, 80);
      const currentTextCanvasData = context.getImageData(
        0,
        0,
        textCanvasRef.current.width,
        textCanvasRef.current.height
      );
      setTextCanvasData(currentTextCanvasData);
      console.log("currentTextCanvasData", currentTextCanvasData);
    } else {
    }
  }, [selectFile]);

  const reTransformData = (originalData, sourceFile) => {
    const { type } = sourceFile;
    let data = originalData.data;
    switch (type) {
      case "image/jpeg":
        handleReTransformPngData(data);
        break;
      case "image/png":
        handleReTransformPngData(data);
        break;
      default:
        break;
    }
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
      if (!workStatus) {
        reTransformData(processData, file.originFileObj);
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
    const { name, type } = selectFile;
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

    const type = selectFile.type;

    switch (type) {
      case "image/jpeg":
        handleConbinatePngCanvasData(imageData, attachData, colorPosition);
        break;
      case "image/png":
        handleConbinatePngCanvasData(imageData, attachData, colorPosition);
        break;
      default:
        message.warning(`缺少${type}类型的处理程序`);
        break;
    }

    canvasRefContext.putImageData(imageDataObject, 0, 0);
  };
  return (
    <section>
      <Card>
        <Space>
          <Upload onChange={onChange} fileList={[]}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
          <Button icon={<CloudDownloadOutlined />} onClick={handleDownload}>
            Down Load
          </Button>
          <Space>
            <Switch
              checkedChildren="加水印"
              unCheckedChildren="解水印"
              defaultChecked={workStatus}
              onChange={(status) => setWorkStatus(status)}
            />
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
