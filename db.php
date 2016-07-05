<?php

class database{				
    private
        $conn,                           
        $stato,           		
        $descrizione_stato,	       
        $stampa_errori=true,              
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
                header("Location: registration.html?".$this->get_descrizione_stato());
                die;
            }
            else
                $this->stato = true;                   

	}		
		
        private function scelta_data_base(){
            if ( !$this->conn->select_db($this->db_name) ){
                $this->stato = false;
                $this->descrizione_stato = 'err_serv';	
                header("Location: registration.html?".$this->get_descrizione_stato());
            }
            else
                $this->stato = true;										
        }
        
        function sanifica_parametro($param){
            return $this->conn->escape_string($param);
        }
        
        function select($query){
            $result= $this->conn->query($query);
            
            if($result===false){
                $this->stato=false;
                $this->descrizione_stato="err_serv";
                $this->close();
            
                if($this->stampa_errori)
                    $this->get_descrizione_stato();

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
        
        function insert($query){
             $esito= $this->conn->query($query);
            
            if($esito){
                $this->stato=true;
                return $this->conn->insert_id;
            }
            else{
                $this->stato=false;
                $this->descrizione_stato="problema con il server";
                
                if($this->stampa_errori){
                    echo $this->get_descrizione_stato();
                }
                
                return false;
            }
        }
        
        function close(){
            $this->conn->close();
        }    		
} 
