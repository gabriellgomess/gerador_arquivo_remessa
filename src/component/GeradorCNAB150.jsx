import React, { useState, useEffect } from "react";
import { Table, Input, Button, Select, Space, message, Card, Badge, Tooltip, Modal, Upload, Spin } from "antd";
import { DeleteOutlined, CloudDownloadOutlined, FileTextOutlined, ImportOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';

import axios from "axios";

const { Column } = Table;
const { Option } = Select;

const GeradorCNAB150 = () => {

    const [dadosDoadores, setDadosDoadores] = useState([]);
    const [importacoes, setImportacoes] = useState([]);
    const [importacao, setImportacao] = useState("");
    const [update, setUpdate] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [importacaoRetModal, setImportacaoRetModal] = useState([]);
    const [dadosImportacao, setDadosImportacao] = useState([]);

    const handleChangeImportacao = (value) => {
        setImportacao(value);
    };

    const handleCreateREM = (id) => {
        const scriptBanco = "gera_rem.php";
        const data = {
            importacao_id: id.id,
        };
        axios.post(`${import.meta.env.VITE_URL_AXIOS}/backend/${scriptBanco}`, data)
            .then((response) => {
                console.log(response.data);
                message.success("Arquivo remessa gerado com sucesso!");
                setUpdate(!update);
            });


    };

    const handleDownloadREM = async (url) => {
        console.log(url);

        try {
            // Busca o arquivo a partir da URL
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao baixar o arquivo: ${response.statusText}`);
            }

            // Converte a resposta em um Blob
            const blob = await response.blob();

            // Cria um link temporário para download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = "arquivo.rem"; // ou outro nome de arquivo conforme necessário

            // Simula um clique no link para baixar o arquivo
            document.body.appendChild(link);
            link.click();

            // Limpa o link temporário após o download
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Falha no download do arquivo:", error);
        }
    };

    const handleDeleteImportacao = (id) => {
        Modal.confirm({
            title: 'Você tem certeza que deseja apagar esta importação?',
            content: 'Esta ação é irreversível e apagará todos os dados relacionados a esta importação.',
            okText: 'Sim, apagar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                // Esta função é chamada quando o usuário confirma a ação
                const scriptBanco = "apaga_importacao.php";
                const data = {
                    importacao_id: id,
                };
                axios.post(`${import.meta.env.VITE_URL_AXIOS}/backend/${scriptBanco}`, data)
                    .then((response) => {
                        console.log(response.data);
                        message.success("Importação apagada com sucesso!");
                        setUpdate(!update);
                    });
            },
            onCancel() {
                // Esta função é chamada quando o usuário cancela a ação
                console.log('Cancelado');
            },
        });
    }

    const handleImportRet = (dados) => {
        setImportacaoRetModal(dados);
        setIsModalOpen(true);
        console.log(dados);
    }
    const handleOk = () => {
        setIsModalOpen(false);
        setFile(null);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setFile(null);
        setDadosImportacao([]);
    };



    const columns = [
        {
            title: "Import ID",
            dataIndex: "importacao_id",
            key: "importacao_id",
            width: 40,
        },
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

    const columns_import = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 40,
        },
        {
            title: "Parceiro",
            dataIndex: "nome_parceiro",
            key: "nome_parceiro",
            width: 40,
        },
        {
            title: "Usuário",
            dataIndex: "usuario",
            key: "usuario",
            width: 40,
            render: (text) => {
                return (
                    <p>{text == 'null' ? "-" : text}</p>
                );
            }
        },
        {
            title: "Data",
            dataIndex: "data",
            key: "data",
            width: 90,
            render: (text) => {
                return (
                    <p>{text?.split(' ')[0].split('-').reverse().join('/')}</p>
                );
            },
        },
        {
            title: "Arquivo REM",
            dataIndex: "arquivo_rem",
            key: "arquivo_rem",
            width: 90,
            render: (text) => {
                return (
                    <>
                        {text ?
                            <a href={text} target="_blank" download>
                                <Badge count={text?.split("/").pop()} color="#70cff5" />
                            </a>
                            :
                            <span>-</span>
                        }
                    </>
                );
            },
        },
        {
            title: "Arquivo RET",
            dataIndex: "arquivo_ret",
            key: "arquivo_ret",
            width: 90,
            render: (text) => {
                return (
                    <>
                        {text ?
                            <a href={text} target="_blank" download>
                                <Badge count={text?.split("/").pop()} color="#faad14" />
                            </a>
                            :
                            <span>-</span>
                        }
                    </>

                );
            },
        },
        {
            title: "Arquivo EXCEL",
            dataIndex: "arquivo_excel",
            key: "arquivo_excel",
            width: 90,
            render: (text) => {
                return (
                    <>
                        {text ?
                            <a href={text} target="_blank" download>
                                <Badge count={text?.split("/").pop()} color="#52c41a" />

                            </a>
                            :
                            <span>-</span>
                        }
                    </>


                );
            },
        },
        {
            title: "Gerar Remessa",
            dataIndex: "id",
            key: "id",
            width: 60,
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Tooltip title={record.arquivo_rem == null ? "Gerar arquivo remessa" : "Arquivo já foi gerado"}>
                            <Button disabled={record.arquivo_rem == null ? false : true} onClick={() => handleCreateREM(record)}><FileTextOutlined /></Button>
                        </Tooltip>
                    </div>

                );
            },
        },
        // {
        //     title: "Importar Retorno",
        //     dataIndex: "id",
        //     key: "id",
        //     width: 60,
        //     render: (text, record) => {
        //         return (
        //             <div style={{ display: 'flex', gap: '5px' }}>
        //                 <Tooltip title={record.arquivo_rem == null ? "Arquivo REM não foi gerado, não existe retorno" : "Importar arquivo retorno"}>
        //                     <Button disabled={record.arquivo_rem == null ? true : false} onClick={() => handleImportRet(record)}><ImportOutlined /></Button>
        //                 </Tooltip>
        //             </div>

        //         );
        //     },
        // },
        {
            title: "Baixar Arquivo Remessa",
            dataIndex: "arquivo_rem",
            key: "arquivo_rem",
            width: 60,
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Tooltip title={text == null ? "Gere o arquivo remessa antes" : "Baixar arquivo remessa"}>
                            <Button disabled={text == null ? true : false} onClick={() => handleDownloadREM(text)}><CloudDownloadOutlined /></Button>
                        </Tooltip>

                    </div>

                );
            },
        },
        {
            title: "Apagar Importação",
            dataIndex: "id",
            key: "id",
            width: 60,
            render: (text, record) => {
                return (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Tooltip title={record.arquivo_rem == null ? "Apagar importação" : "Arquivo remessa gerado, não é possível apagar a importação"}>
                            <Button disabled={record.arquivo_rem == null ? false : true} danger onClick={() => handleDeleteImportacao(text)}><DeleteOutlined /></Button>
                        </Tooltip>
                    </div>

                );
            },
        },
    ]

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_URL_AXIOS}/backend/consulta_doadores.php`)
            .then((response) => {
                setDadosDoadores(response.data);
            });
    }, []);

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_URL_AXIOS}/backend/lista_importacoes.php`)
            .then((response) => {
                setImportacoes(response.data);
            });
    }, [update]);

    const handleSend = () => {
        if (file) {
            setLoading(true);
            const formData = new FormData();
            formData.append("arquivo_retorno", file);
            formData.append("importacao_id", importacaoRetModal.id);
            formData.append("parceiro", importacaoRetModal.parceiro);
            axios.post(`${import.meta.env.VITE_URL_AXIOS}/backend/read_ret.php`, formData)
                .then((response) => {
                    console.log(response.data);
                    message.success("Arquivo de retorno importado com sucesso!");
                    setLoading(false);
                    setUpdate(!update);
                    // setIsModalOpen(false);
                    setFile(null);
                    setDadosImportacao(response.data);
                });
        } else {
            message.error("Selecione um arquivo antes de enviar!");
        }
    }

    const handleRemoveFile = () => {
        setFile(null);
    };

    const beforeUpload = (file) => {
        setFile(file);
        return false;
    };

    return (
        <div style={{ width: "70%", margin: '30px auto' }}>

            <Card title="Gerador de arquivo remessa CNAB 150" bordered={false} style={{ width: '100%', marginBottom: '20px' }}>
                <p>
                    <strong>Atenção:</strong> O arquivo remessa gerado é compatível com o layout CNAB 150 da Febraban.
                </p>
                <p>
                    <strong>Como gerar o arquivo remessa:</strong> Selecione no menu a importação que deseja gerar o arquivo remessa e clique no botão "Gerar arquivo remessa".
                </p>
                <p>Com o arquivo gerado, na tabela irá habilitar o botão Baixar REM, clicando nele será iniciado o download do arquivo.</p>
            </Card>


            <Table
                style={{ marginTop: 20 }}
                dataSource={importacoes}
                columns={columns_import}
                pagination={{ pageSizeOptions: [5, 10, 20, 50, 100], pageSize: 10 }}
                scroll={{ x: "max-content" }}
            />

            <Modal title="Importação do arquivo retorno" open={isModalOpen} onOk={handleSend} onCancel={handleCancel}>
                <p>Selecione o arquivo de retorno referente à importação nº {importacaoRetModal?.id}</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <Upload
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        accept=".ret, .RET"
                    >
                        <Button icon={<UploadOutlined />}>Selecionar arquivo</Button>
                    </Upload>
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
                                backgroundColor: '#70cff5',
                                padding: '5px',
                                borderRadius: '5px',
                            }}
                        />
                    )}
                </div>
                <div>
                    {dadosImportacao && (
                        <>
                            <p>Data da geração: {dadosImportacao.data_geracao?.split('-').reverse().join('/')}</p>
                            <p>Débitos Efetuados: {dadosImportacao.debitos_efetuados}</p>
                            <p>Registros Afetados: {dadosImportacao.registros_afetados}</p>
                        </>
                    )}
                </div>

                <div style={{ display: "flex", gap: "10px", height: '50px' }}>
                    {/* {file && (
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
                                backgroundColor: '#70cff5',
                                padding: '5px',
                                borderRadius: '5px',
                            }}
                        />
                    )} */}
                </div>
            </Modal>

        </div>
    );
};

export default GeradorCNAB150;
