import React, { useState } from "react";
import { Button, Upload, message, Badge } from "antd";
import { UploadOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const ImportadorExcel = () => {
    const [file, setFile] = useState(null);

    const beforeUpload = (file) => {
        setFile(file);
        return false;
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleSend = () => {
        if (!file) {
            message.error("Nenhum arquivo selecionado");
            return;
        }

        const formData = new FormData();
        formData.append("excelFile", file);

        axios
            .post(`${import.meta.env.VITE_URL_AXIOS}/backend/processa_excel.php`, formData)
            .then((res) => {
                console.log(res);
                message.success("Dados importados com sucesso");
                setFile(null); // Clear the input
            })
            .catch((err) => {
                console.log(err);
                message.error("Erro ao importar os dados");
            });
    };

    return (
        <div style={{ width: "70%", margin: "30px auto", display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: "flex", gap: "10px" }}>
                <Upload
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                    accept=".xlsx, .xls"
                >
                    <Button icon={<UploadOutlined />}>Selecionar arquivo</Button>
                </Upload>
                <Button type="primary" onClick={handleSend}>
                    Enviar
                </Button>
            </div>
            <div style={{ display: "flex", gap: "10px", height: '50px' }}>
                {file && (
                    <Badge
                        count={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
                                {file.name}{" "}
                                <CloseOutlined
                                    onClick={handleRemoveFile}
                                    style={{ color: "##fff", cursor: "pointer", fontWeight: 'bold' }}
                                />
                            </div>
                        }
                        style={{
                            backgroundColor: '#52c41a',
                            padding: '5px',
                            borderRadius: '5px',
                        }}
                    />
                )}
            </div>

        </div>
    );
};

export default ImportadorExcel;
