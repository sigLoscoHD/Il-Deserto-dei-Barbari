
<?php

//File contenente una classe con tutti i metodi pubblici di interfaccia al Database
class database{				
    private
        $conn,                           
        $stato,           		
        $descrizione_stato,            
        $host="localhost",
        $username="root",
        $password="db",
        $db_name="db_deserto";
    
        public function get_stato(){
            return $this->stato;
        }

        public function get_descrizione_stato(){
            return $this->descrizione_stato;
        }
        
        /*
         * _construct è il costruttore della classe database 
         *  che si occupa di instaurare la connessione al db
         * attraverso i due metodi connessione() e scelta_data_base()
         */
        
        public function __construct(){ 
            $this->connessione();

            if( $this->stato )
                $this->scelta_data_base();           
            if(!$this->stato){
                $this->close();
                die;
            }
        }


	private function connessione(){
            $this->conn = new mysqli( $this->host,
                                      $this->username,
                                      $this->password
                                    );  

            if($this->conn->connect_error){                      
                $this->stato = false;
                $this->descrizione_stato = 'err_serv';	
                header("Location: ../index.html?mex=".$this->get_descrizione_stato());
                die;
            }
            else
                $this->stato = true;                   

	}		
		
        private function scelta_data_base(){
            if ( !$this->conn->select_db($this->db_name) ){
                $this->stato = false;
                $this->descrizione_stato = 'err_serv';	
                header("Location: ../index.html?mex=".$this->get_descrizione_stato());
            }
            else
                $this->stato = true;										
        }
        
        /*
         * questa funzione permette per motivi di sicurezza di non usare determinati
         * caratteri utili ad utilizzare attacchi SQL injection
         */
        function sanifica_parametro($param){
            return $this->conn->escape_string($param);
        }
        
        /*
         * funzione che permette l'esecuzione di query su db
         */
        function select($query){
            $result= $this->conn->query($query);
            
            if($result===false){
                $this->stato=false;              
                $this->close();
                return false;
            }
            else{
                
                $this->stato=true;
                
                $rows=array();
                while($row = $result->fetch_assoc()){
                    $rows[]=$row;
                }
                
                return $rows;
            }
        }
        
        /*
         * funzione per inserire dati nel db
         */
        function insert($query){
             $esito= $this->conn->query($query);
            
            if($esito){
                $this->stato=true;
                return $this->conn->insert_id;
            }
            else{
                $this->stato=false;           
                return false;
            }
        }
        
        /*
         * funzione per aggiornare dati sul db
         */
        function update($query){
             $num= $this->conn->query($query);
            
            if($num==TRUE){
                $this->stato=true;
                return $num;
            }
            else{
                $this->stato=false;           
                return false;
            }
        }
        
        function close(){
            $this->conn->close();
        }    		
} 
