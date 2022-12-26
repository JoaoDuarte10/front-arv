import React, { useState } from "react";
import { TitlePrincipal } from '../components/titles/TitlePrincipal';
import { Breadcumb } from '../components/Breadcumb';
import FullWidthTextField from '../components/inputs/TextFieldFullWidth';
import TextFieldMultiline from '../components/inputs/TextFieldMultiline';
import InputMaskPhone from '../components/inputs/InputMaskPhone';
import InputMaskNumber from '../components/inputs/InputMaskNumber';
import { ClientService } from '../service/client-service';
import { AlertError } from '../components/alerts/AlertError';
import { AlertSuccess } from '../components/alerts/AlertSuccess';
import { TIMEOUT } from '../utils/constants';

export function CreateClient(props: { clientService: ClientService }) {
    const { clientService } = props;

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [addressNumber, setAddressNumber] = useState<number | any>();
    const [note, setNote] = useState<string>();

    const [serverError, setServerError] = useState<boolean>(false);
    const [successRequest, setSuccessRequest] = useState<boolean>(false);
    const [conflictError, setConflictError] = useState<boolean>(false);
    const [invalidParams, setInvalidParams] = useState<boolean>(false);

    const clearFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setAddressNumber('');
        setNote('');
    };

    const createClient = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        const { error, conflict, badRequest } = await clientService.createClinet({
            name, email, phone, address, addressNumber, note
        });

        if (error) {
            setServerError(true);
            return;
        }

        if (conflict) {
            setConflictError(true);
            return;
        }

        if (badRequest) {
            setInvalidParams(true);
            return;
        }

        setSuccessRequest(true);
        clearFields();
    }

    if (serverError) {
        setTimeout(() => setServerError(false), TIMEOUT.THREE_SECCONDS);
    }

    if (successRequest) {
        setTimeout(() => setSuccessRequest(false), TIMEOUT.THREE_SECCONDS);
    }

    if (conflictError) {
        setTimeout(() => setConflictError(false), TIMEOUT.THREE_SECCONDS);
    }

    if (invalidParams) {
        setTimeout(() => setInvalidParams(false), TIMEOUT.THREE_SECCONDS);
    }

    return (
        <div className="container-main">
            <Breadcumb page={[{ link: '/clients', name: "Clientes" }, { link: false, name: "Novo Cliente" }]} />
            <TitlePrincipal title="Novo cliente" />

            <div className="form_client">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="60" fill="#0275d8" className="bi bi-person-add" viewBox="0 0 16 16">
                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                        <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                    </svg>
                </div>
                <FullWidthTextField
                    label="Nome*"
                    value={name}
                    fnChange={(e: React.BaseSyntheticEvent) => {
                        setName(e.target.value);
                    }}
                />
                <FullWidthTextField
                    label="E-mail"
                    value={email}
                    fnChange={(e: React.BaseSyntheticEvent) => {
                        setEmail(e.target.value);
                    }}
                />
                <InputMaskPhone
                    label="Celular*"
                    value={phone}
                    fnChange={(e: React.BaseSyntheticEvent) => {
                        setPhone(e.target.value);
                    }}
                />
                <div className="row">
                    <div className="col-8">
                        <FullWidthTextField
                            label="Endereço"
                            value={address}
                            fnChange={(e: React.BaseSyntheticEvent) => {
                                setAddress(e.target.value);
                            }}
                        />
                    </div>
                    <div className="col-4">
                        <InputMaskNumber
                            label="Número"
                            value={addressNumber}
                            fnChange={(e: React.BaseSyntheticEvent) => {
                                setAddressNumber(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <TextFieldMultiline
                    label="Observação"
                    value={note}
                    fnChange={(e: React.BaseSyntheticEvent) => {
                        setNote(e.target.value);
                    }}
                />
                <button
                    className="btn btn-primary col p-2 mt-2 font-weight-bold"
                    onClick={e => createClient(e)}
                >
                    Criar
                </button>

                <div className="mt-3">
                    {serverError ? (
                        <AlertError title="Erro ao processar sua requisição." />
                    ) : null}
                    {successRequest ?
                        <AlertSuccess title="Cliente criado com sucesso" />
                        : null
                    }
                    {conflictError ? (
                        <AlertError title="Esse cliente já existe." />
                    ) : null}
                    {invalidParams ? (
                        <AlertError title="Preencha os campos corretamente." />
                    ) : null}
                </div>
            </div>
        </div>
    )
}