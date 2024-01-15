import React, { useEffect } from 'react';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ComeBack } from '../../components/ComeBack';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { LabelSmall } from '../../components/labels/LabelSmal';
import { LabelForm } from '../../components/labels/LabelForm';
import { DivInline } from '../../components/containers/DivInline';
import { SalesService } from '../../service/api/sales/sales';
import { TableSales } from '../../components/sales/TableSales';
import { SearchFilterButton } from '../../components/buttons/SearchFilter';
import { TIMEOUT } from '../../utils/constants';
import { ClearSearchFilterButton } from '../../components/buttons/ClearSearchFilter';
import { WhatsAppIconButton } from '../../components/buttons/WhatsAppIconButton';
import { EditIconButton } from '../../components/buttons/EditIconButton';
import { BasicDeleteModal } from '../../components/modal/BasicDeleteModal';
import { Typography } from '@mui/material';
import { WhatsAppService } from '../../service/api/whatsapp/whatsapp';
import { useClient } from './hooks/useClients';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';

export const INFO_CLIENT_URL = '/client/info/';

export function InfoClients(props: {
  salesService: SalesService;
  whatsAppService: WhatsAppService;
}) {
  const {
    resources,
    handleDeleteResource,
    fetchSalesByClient,
    fetchSalesPending,
    alert,
    setAlert,
    sales,
    setSales,
    loading,
  } = useClient();

  const { id } = useParams();

  const { salesService, whatsAppService } = props;

  const navigate = useNavigate();

  const client = resources.find(client => client.id === Number(id));

  useEffect(() => {
    if (!id) {
      navigate(-1);
    }
  }, [id]);

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <CircularIndeterminate open={loading} />

      <Breadcumb
        page={[
          { link: '/clients', name: 'Clientes' },
          { link: false, name: 'Informações do cliente' },
        ]}
      />
      <ComeBack />
      <br />
      <TitlePrincipal title="Informações do cliente" />

      {client && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <WhatsAppIconButton
            onClick={(e: React.SyntheticEvent) => {
              whatsAppService.redirectToWhatsapp(e, client.phone);
            }}
          />
          <Link className="" to={`/client/edit/${client.id}`}>
            <EditIconButton />
          </Link>
          <BasicDeleteModal
            btnName="Excluir"
            onChange={(e: React.SyntheticEvent) => {
              handleDeleteResource(client.id);
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: 'red' }}
            >
              Excluir Cliente
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Tem certeza que deseja excluir esse cliente?
            </Typography>
          </BasicDeleteModal>
        </div>
      )}
      {client ? (
        <div className="container_info_client">
          <LabelForm text="Nome" className="pb-2 border-bottom">
            <LabelSmall text={client.name} />
          </LabelForm>
          <DivInline className="row">
            <LabelForm text="E-mail" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.email || 'Não informado'} />
            </LabelForm>
            <LabelForm text="Celular" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.phone || 'Não informado'} />
            </LabelForm>
          </DivInline>
          <DivInline className="row">
            <LabelForm text="Endereço" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address &&
                    client.address.address &&
                    client.address.address) ||
                  'Não informado'
                }
              />
            </LabelForm>
            <LabelForm text="Número" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address &&
                    client.address.number &&
                    client.address.number) ||
                  'Não informado'
                }
              />
            </LabelForm>
          </DivInline>
          <DivInline className="row">
            <LabelForm text="CEP" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address &&
                    client.address.cep &&
                    client.address.cep
                      .toString()
                      .replace(/\D/g, '')
                      .replace(/(\d{5})(\d)/, '$1-$2')
                      .replace(/(-\d{3})\d+?$/, '$1')) ||
                  'Não informado'
                }
              />
            </LabelForm>
            <LabelForm text="Cidade" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address &&
                    client.address.city &&
                    client.address.city) ||
                  'Não informado'
                }
              />
            </LabelForm>
          </DivInline>
          <DivInline className="row">
            <LabelForm text="Estado" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address && client.address.uf && client.address.uf) ||
                  'Não informado'
                }
              />
            </LabelForm>
            <LabelForm text="Bairro" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall
                text={
                  (client.address &&
                    client.address.neighborhood &&
                    client.address.neighborhood) ||
                  'Não informado'
                }
              />
            </LabelForm>
          </DivInline>
          <LabelForm text="Complemento" className="pb-2 border-bottom">
            <LabelSmall
              text={
                (client.address &&
                  client.address.complement &&
                  client.address.complement) ||
                'Não informado'
              }
            />
          </LabelForm>
          <LabelForm text="Segmento" className="pb-2 border-bottom">
            <LabelSmall text={client.segment || 'Nenhum segmento'} />
          </LabelForm>
          <LabelForm text="Criado em" className="pb-2 border-bottom">
            <LabelSmall
              text={format(
                new Date(client.createdAt.replace('Z', '')),
                "dd/MM/yyyy 'às' HH:mm'h'",
              )}
            />
          </LabelForm>
          <LabelForm text="Última atualização" className="pb-2 border-bottom">
            <LabelSmall
              text={
                client.updatedAt
                  ? format(
                      new Date(client.updatedAt.replace('Z', '')),
                      "dd/MM/yyyy 'às' HH:mm'h'",
                    )
                  : 'Nenhuma atualização'
              }
            />
          </LabelForm>
          <LabelForm text="Observação">
            <LabelSmall text={client.note || 'Nenhuma observação'} />
          </LabelForm>
        </div>
      ) : null}

      <hr className="mt-4" />

      <div>
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) =>
            fetchSalesByClient(Number(id))
          }
          text="Vendas do cliente"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) =>
            fetchSalesPending(Number(id))
          }
          text="Vendas pendentes"
        />
        <ClearSearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => setSales([])}
        />

        {alert}

        {sales.length ? (
          <div>
            <TableSales sales={sales} salesService={salesService} />
            <strong>Total:</strong>{' '}
            {salesService.countTotalValueSales(
              sales
                .filter(sale => sale.paymentStatus === 'PAID')
                .map(sale => Number(sale.total)),
            )}
          </div>
        ) : null}
      </div>
    </ContainerMain>
  );
}
