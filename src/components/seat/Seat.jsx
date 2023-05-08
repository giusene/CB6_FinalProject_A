import styles from "./index.module.scss";

const Seat = ({
  seatData,
  setCount,
  setTicketList,
  seatNumber,
  ticketInfo,
  isSelected,
  selectedHour,
}) => {
  const onHandleClick = (seatNumber) => {

    if (selectedHour) {
      if (!seatData) {
        if (isSelected) {
          setCount((prev) => prev - 1);

        } else {
          setCount((prev) => prev + 1);
        }
        setTicketList((prev) => {
          if (prev.filter((ticket) => ticket.seatNum === seatNumber).length) {
            return prev.filter((ticket) => ticket.seatNum !== seatNumber);
          } else {
            return [
              ...prev,
              {
                ...ticketInfo,
                seatNum: seatNumber,
              },
            ];
          }
        });
      }
    }
  };

  return (
    <div
      className={`${styles.Seat} ${!selectedHour && styles.notAllowed} ${
        seatData && styles.reserved
      } ${isSelected && styles.selected} `}
      onClick={() => onHandleClick(seatNumber)}
    ></div>
  );
};

export default Seat;
