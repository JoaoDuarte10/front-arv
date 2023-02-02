import React from "react";

import { SegmentInterface } from "../service/api/segment/types";
import { InputText } from "./inputs/InputText";
import { DivInline } from "./containers/DivInline";

type InputProps = {
  editSegment: Function;
  title: string;
  actionCreate: Function;
  actionUpdate: Function;
  actionName: string;
  clearStates: any;
  segment: SegmentInterface;
  setNewSegment: Function;
  alert: JSX.Element | null;
};

export function CardSegment(props: InputProps) {
  const {
    editSegment,
    title,
    actionCreate,
    actionUpdate,
    actionName,
    clearStates,
    segment,
    setNewSegment,
    alert
  } = props;

  return (
    <div
      className="modal fade"
      id="modalSegment"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{title}</h5>
            <button
              type="button"
              className="close"
              onClick={clearStates}
              data-dismiss="modal"
              aria-label="Fechar"
              key={0}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <InputText
              type="text"
              id="procedure"
              value={segment ? segment.name : ""}
              onChange={(e: React.BaseSyntheticEvent) =>
                setNewSegment({
                  name: e.target.value,
                  idsegments: segment.idsegments
                })
              }
              label="Digite o segmento"
              required={true}
            />
            <DivInline className="mt-3">
              <div className="col">
                <button
                  type="reset"
                  onClick={() => {
                    clearStates();
                    setNewSegment("");
                  }}
                  className="btn btn-outline-secondary col p-2"
                  data-dismiss="modal"
                  key={3}
                >
                  Fechar
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-primary col p-2"
                  type="button"
                  onClick={e => {
                    editSegment
                      ? actionUpdate(e, segment)
                      : actionCreate(e, segment.name);
                  }}
                >
                  {actionName}
                </button>
              </div>
            </DivInline>
            {alert}
          </div>
        </div>
      </div>
    </div>
  );
}
