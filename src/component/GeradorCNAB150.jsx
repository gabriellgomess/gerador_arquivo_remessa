import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select, Space,  message, Card } from "antd";
import axios from "axios";

const { Column } = Table;
const { Option } = Select;

const GeradorCNAB150 = () => {
    const [banco, setBanco] = useState("");
    const [parceiro, setParceiro] = useState("");
    const [dadosDoadores, setDadosDoadores] = useState([]);


    const handleChangeBanco = (value) => {
        setBanco(value);
    };    
    const handleChangeParceiro = (value) => {
        setParceiro(value);
    };

    const handleDownload = async () => {
        try {
            const scriptBanco = banco + "_gera_rem.php";
            const url = `${import.meta.env.VITE_URL_AXIOS}/backend/${scriptBanco}`;  
            
            const dataAtual = new Date();
            const dataFormatadaAtual =
                dataAtual.getFullYear().toString() +
                ("0" + (dataAtual.getMonth() + 1)).slice(-2) +
                ("0" + dataAtual.getDate()).slice(-2);

            const formData = new FormData();
            formData.append("nome_banco", banco);
            formData.append("parceiro", parceiro);

            const response = await axios.post(url, formData, {
                responseType: "blob",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const blob = new Blob([response.data], {
                type: "application/octet-stream",
            });
            const blobUrl = window.URL.createObjectURL(blob);

            console.log("blobUrl: ", blobUrl)

            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            const nomeArquivo = banco + dataFormatadaAtual + ".REM";
            downloadLink.download = nomeArquivo;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            message.error("Erro ao baixar o arquivo.");
        }
    };

    const columns = [
        {
            title: "Nome",
            dataIndex: "nome",
            key: "nome",
            width: 180,
        },
        {
            title: "CPF/CNPJ",
            dataIndex: "cpf",
            key: "cpf",
            width: 130,
        },
        {
            title: "Banco",
            dataIndex: "banco",
            key: "banco",
            width: 60,
        },
        {
            title: "Agência",
            dataIndex: "agencia",
            key: "agencia",
            width: 60,
        },
        {
            title: "Conta",
            dataIndex: "conta",
            key: "conta_corrente",
            width: 100,
        },
        {
            title: "Dígito",
            dataIndex: "digito",
            key: "digito_conta",
            width: 30,
        },
        {
            title: "Valor",
            dataIndex: "valor",
            key: "valor",
            width: 90,
            render: (text) => {
                return new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(text);
            },
        },        
        {
            title: "Vencimento",
            dataIndex: "vencimento",
            key: "vencimento",
            width: 90,
            render: (text) => {
                return text?.split("-").reverse().join("/");
            },
        },
        {
            title: "Nº Proposta",
            dataIndex: "cod_proposta_parceiro",
            key: "cod_proposta_parceiro",
            width: 110,
        },
        {
            title: "Parceiro",
            dataIndex: "parceiro",
            key: "parceiro",
            width: 30,
        },
    ];

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_URL_AXIOS}/backend/consulta_doadores.php`)
            .then((response) => {
                setDadosDoadores(response.data);
            });
    }, []);

    return (
        <div style={{ width: "70%", margin: '30px auto' }}>

            <Card title="Gerador de arquivo remessa CNAB 150" bordered={false} style={{ width: '100%', marginBottom: '20px' }}>
                <p>
                    <strong>Atenção:</strong> O arquivo remessa gerado é compatível com o layout CNAB 150 da Febraban e de acordo com o banco selecionado, será aplicado o padrão daquela instituição.
                </p>
                <p>
                    <strong>Como gerar o arquivo remessa:</strong> Selecione o banco, informe a data de vencimento e clique no botão "Gerar arquivo remessa", será realizado o download do arquivo no seu computador, este arquivo deverá ser enviado para o banco para que seja feita a cobrança.
                </p>
            </Card>

            <Space style={{ marginBottom: 16 }}>
                <Select
                    style={{ width: 200 }}
                    placeholder="Parceiro"
                    value={parceiro}
                    onChange={handleChangeParceiro}
                >
                    <Option value="">Selecionar Parceiro</Option>
                    <Option value="54666">AMF Promotora</Option>
                    <Option value="2">Apobem</Option>
                </Select>
                <Select
                    style={{ width: 200 }}
                    placeholder="Banco"
                    value={banco}
                    onChange={handleChangeBanco}
                >
                    <Option value="">Selecionar Banco</Option>
                    <Option value="ITAU">Itaú</Option>
                    <Option value="BANRISUL">Banrisul</Option>
                    {/* <Option value="BB">Banco do Brasil</Option>
                      <Option value="CAIXA">Caixa</Option> */}
                </Select>
               
                <Button type="primary" onClick={handleDownload}>
                    Gerar arquivo remessa
                </Button>
            </Space>
            <Table
                style={{ marginTop: 20 }}
                dataSource={dadosDoadores}
                columns={columns}
                pagination={{ pageSizeOptions: [5, 10, 20, 50, 100], pageSize: 10 }}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};

export default GeradorCNAB150;
