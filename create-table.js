connection.connect(function(err){
    if(err) return console.log(err);
    console.log('conectou!');

    insertCidade(connection,[
        ['João Pessoa', '2507507']
    ]);

})
  
function insertCidade(conn, values){
    insert(conn, "cidades", "nome, codigo", values);
}

function insert(conn, table, columns, values){
    const sql = "INSERT INTO "+table+"("+columns+") VALUES ?";
    conn.query(sql, [values], function (error, results, fields){
        if(error) return console.log(error);
            
        console.log('adicionou registros!');
        conn.end();//fecha a conexão
    });
}