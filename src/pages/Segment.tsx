import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertInfo } from "../components/alerts/AlertInfo";
import { AlertError } from "../components/alerts/AlertError";
import { Breadcumb } from "../components/Breadcumb";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";
import { TIMEOUT } from "../utils/constants";
import { AlertSuccess } from "../components/alerts/AlertSuccess";
import { SegmentService } from "../service/api/segment/segment";
import { SegmentInterface } from "../service/api/segment/types";
import { segmentAdded } from "../reducers/segment-sclice";
import { ReduceStore } from "../app/store";
import { ButtonFilterAction } from "../components/buttons/ButtonFilterAction";
import { TopModal } from "../components/modal/TopModal";
import { CardSegment } from "../components/CardSegment";
import { format } from "date-fns";
import { ContainerMain } from "../components/containers/ContainerMain";
import { CircularIndeterminate } from "../components/loaders/CircularLoader";
import { DivInline } from "../components/containers/DivInline";
import { LabelForm } from "../components/labels/LabelForm";
import { LabelSmall } from "../components/labels/LabelSmal";
import { randomId } from "../utils/random";

type InputProps = {
  segmentService: SegmentService;
};

export function Segment(props: InputProps) {
  const { segmentService } = props;
  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const dispatch = useDispatch();

  const [segments, setSegments] = useState<SegmentInterface[]>([]);

  const [titleCardSegment, setTitleCardSegment] = useState<string>("");
  const [actionName, setActionName] = useState<string>("");
  const [editSegmentName, setEditSegmentName] = useState<SegmentInterface>(
    {} as any
  );
  const [editSegment, setEditSegment] = useState<boolean | null>(null);
  const [segmentWithDelete, setSegmentWithDelete] = useState<SegmentInterface>(
    {} as any
  );

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const getSegments = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await segmentService.getAll();
    setLoader(null);

    dispatch(segmentAdded(data));
    setSegments(data);
  };

  useEffect(() => {
    if (!segmentCache.length) {
      getSegments();
    } else {
      setSegments(segmentCache);
    }
  }, []);

  const formFieldsIsValids = (segment: string): boolean => {
    if (!segment || !segment.trim() || segment.length > 50) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
      return false;
    }
    return true;
  };

  const onAddNewSegment = async (
    event: React.BaseSyntheticEvent,
    segment: string
  ) => {
    event.preventDefault();

    if (!formFieldsIsValids(segment)) return;

    setLoader(<CircularIndeterminate />);
    const { success, conflict, error } = await segmentService.create(segment);
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Segmento criado com sucesso." />);
      getSegments();
    }

    if (conflict) {
      setAlert(<AlertInfo title="Esse segmento já existe." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const updateSegmentRequest = async (
    event: React.BaseSyntheticEvent,
    segment: SegmentInterface
  ) => {
    event.preventDefault();

    setLoader(<CircularIndeterminate />);
    const { success, notFound, error } = await segmentService.update(
      segment.idsegments,
      segment.name
    );
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Segmento atualizado com sucesso." />);
      getSegments();
      setEditSegmentName({} as any);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Segmento não encontrado." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const onDeleteSegment = async (
    event: React.BaseSyntheticEvent,
    idsegments: number
  ) => {
    event.preventDefault();

    setLoader(<CircularIndeterminate />);
    const { success, notFound, error, conflict } = await segmentService.delete(
      idsegments
    );
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Segmento deletado com sucesso." />);
      getSegments();
    }

    if (notFound) {
      setAlert(<AlertInfo title="Segmento não encontrado." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }

    if (conflict) {
      setAlert(
        <AlertError title="Não é possível excluir esse segmento pois há clientes associados à ele." />
      );
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loader}
      <Breadcumb page={[{ link: false, name: "Segmentos" }]} />
      <TitlePrincipal title="Segmentos" />

      <ButtonFilterAction
        onClick={(e: React.BaseSyntheticEvent) => {
          const filterBySegmentElement = document.getElementById(
            "searchBySegment"
          );
          if (filterBySegmentElement)
            filterBySegmentElement.style.display = "none";

          setTitleCardSegment("Novo");
          setActionName("Criar");
          setEditSegment(false);
        }}
        text="Novo"
        className="pl-3 pr-3 mb-2"
        dataToggle="modal"
        dataTarget="modalSegment"
      />

      {alert}

      <TopModal
        className="btn btn-danger"
        id="delete-segment"
        title="Excluir segmento?"
        body="Tem certeza que deseja excluir esse segmento?"
        click={(e: React.BaseSyntheticEvent) => {
          if (segmentWithDelete) {
            onDeleteSegment(e, segmentWithDelete.idsegments);
          }
        }}
        button="Excluir"
      />

      <CardSegment
        editSegment={editSegment as any}
        title={titleCardSegment}
        actionName={actionName}
        segment={editSegmentName}
        clearStates={(e: React.BaseSyntheticEvent) =>
          setEditSegmentName({} as any)
        }
        actionCreate={(e: React.BaseSyntheticEvent, segment: any) =>
          onAddNewSegment(e, segment)
        }
        actionUpdate={updateSegmentRequest}
        setNewSegment={setEditSegmentName}
        alert={alert}
      />

      {segments.length ? (
        segments.map(segment => {
          return (
            <div
              className="container_segment"
              key={segment.idsegments + randomId()}
            >
              <LabelForm text="Segmento" className="mb-2 pb-2 border-bottom">
                <LabelSmall text={segment.name} />
              </LabelForm>

              <LabelForm text="Criado em" className="mb-2 pb-2 border-bottom">
                <LabelSmall
                  text={format(
                    new Date(segment.createdAt.replace("Z", "")),
                    "dd/MM/yyyy 'às' HH:mm'h'"
                  )}
                />
              </LabelForm>

              <DivInline>
                <button
                  className="btn btn-outline-primary font-weight-bold"
                  data-toggle="modal"
                  data-target="#modalSegment"
                  onClick={(e: React.BaseSyntheticEvent) => {
                    setTitleCardSegment("Editar");
                    setActionName("Salvar");
                    setEditSegmentName(segment);
                    setEditSegment(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-outline-danger font-weight-bold ml-2"
                  data-toggle="modal"
                  data-target="#delete-segment"
                  onClick={(e: React.BaseSyntheticEvent) =>
                    setSegmentWithDelete(segment)
                  }
                >
                  Deletar
                </button>
              </DivInline>
            </div>
          );
        })
      ) : (
        <h5 className="pt-4">Nenhum segmento</h5>
      )}
    </ContainerMain>
  );
}
